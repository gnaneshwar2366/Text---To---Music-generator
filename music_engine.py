import os
import uuid
import re
from typing import Dict, Any, Tuple, List

import torch
import torchaudio

from audiocraft.models import MusicGen
from diffusers import StableDiffusionPipeline
from transformers import pipeline


def _format_case(text: str) -> str:
    text = re.sub(r'\s+', ' ', text or '').strip()
    if not text:
        return ""
    small = {"a","an","and","as","at","but","by","for","from","in","into","of","on","or","over","the","to","with"}
    words = text.split()
    out = []
    for i, w in enumerate(words):
        lw = w.lower()
        out.append(lw if i not in (0, len(words) - 1) and lw in small else lw.capitalize())
    return " ".join(out)


def _sanitize_title(text: str, max_len: int = 80) -> str:
    t = (text or "")
    t = t.split("Description:")[0]             # drop trailing “Description: …”
    t = re.sub(r'<[^>]*>', '', t)              # remove <placeholders>
    t = re.sub(r'^(song title inspired by|title)\s*[:\-]?\s*', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s+', ' ', t).strip()
    t = _format_case(t)
    if not t:
        t = "Untitled AI Track"
    if len(t) > max_len:
        t = t[:max_len].rstrip()
    return t


def _infer_genres_from_prompt(p: str) -> List[str]:
    p = (p or "").lower()
    matches: List[str] = []
    if any(k in p for k in ["epic","orchestral","symphon","trailer"]): matches.append("Epic Orchestral")
    if any(k in p for k in ["choir","choral","choirs"]): matches.append("Cinematic Choir")
    if any(k in p for k in ["drum","taiko","battle","war"]): matches.append("Battle Drums")
    if any(k in p for k in ["hip hop","hiphop","trap","boom bap"]): matches.append("Hip Hop")
    if any(k in p for k in ["ambient","pad","atmos","soundscape"]): matches.append("Ambient")
    if any(k in p for k in ["electro","edm","synth","techno"]): matches.append("Electronic")
    out: List[str] = []
    for g in matches:
        if g not in out:
            out.append(g)
        if len(out) == 3:
            break
    return out or ["AI Multi-Agent"]


def _extract_title_and_genres(generated: str, fallback_prompt: str) -> Tuple[str, List[str]]:
    txt = generated or ""
    # strict pattern “Title: X | Genres: A, B, C”
    m = re.search(r"Title\s*[:\-]\s*(.+?)\s*\|\s*Genres\s*[:\-]\s*(.+)", txt, flags=re.IGNORECASE | re.DOTALL)
    if m:
        raw_title = re.sub(r'[\r\n]+', ' ', m.group(1)).strip()
        raw_genres = [g.strip(" .,-") for g in m.group(2).split(",") if g.strip()]
    else:
        m2 = re.search(r"Title\s*[:\-]\s*(.+)", txt, flags=re.IGNORECASE)
        raw_title = re.sub(r'[\r\n]+', ' ', m2.group(1)).strip() if m2 else (fallback_prompt or "")
        raw_genres = []

    title = _sanitize_title(raw_title)
    if re.search(r'<[^>]+>', raw_title) or not title or re.search(r'\b(title here|cool title)\b', title, flags=re.I):
        title = _sanitize_title(fallback_prompt)

    genres = []
    for g in raw_genres:
        if not g or re.search(r'<[^>]+>', g) or re.search(r'\bgenre\s*\d+\b', g, flags=re.I):
            continue
        genres.append(_format_case(g))
        if len(genres) == 3:
            break
    if not genres:
        genres = _infer_genres_from_prompt(fallback_prompt)
    return title, genres


class MultiAgentGenerator:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        print("Loading MusicGen Small (Memory Optimized)...")
        self.music_model = MusicGen.get_pretrained("facebook/musicgen-small")

        print(f"Loading Stable Diffusion on {self.device}...")
        if self.device == "cuda":
            self.img_pipe = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16
            ).to("cuda")
        else:
            self.img_pipe = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5", torch_dtype=torch.float32
            ).to("cpu")

        print("Loading Title Agent (GPT-2)...")
        self.title_gen = pipeline(
            "text-generation",
            model="gpt2",
            device=0 if self.device == "cuda" else -1
        )

        os.makedirs("static", exist_ok=True)

    def generate_title_and_genres(self, prompt: str) -> Tuple[str, List[str]]:
        instr = (
            "Create a concise, original music track title and three specific sub-genres.\n"
            "Return EXACTLY in one line:\n"
            "Title: Cool Title | Genres: Genre1, Genre2, Genre3\n"
            "No angle brackets, no placeholders, no extra text.\n"
            f"Prompt: {prompt}\n"
            "Answer:"
        )
        out = self.title_gen(
            instr,
            max_new_tokens=60,
            do_sample=True,
            temperature=0.9,
            top_p=0.95,
            pad_token_id=50256,
            eos_token_id=50256
        )[0]["generated_text"]
        return _extract_title_and_genres(out, prompt)

    def generate_all(self, prompt: str, duration: int) -> Dict[str, Any]:
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        base_id = uuid.uuid4().hex[:8]

        # Title + Genres
        clean_title, genres = self.generate_title_and_genres(prompt)
        primary_genre = genres[0]
        sub_genres = genres

        # Music
        with torch.inference_mode():
            self.music_model.set_generation_params(duration=duration)
            wav_list = self.music_model.generate([prompt], progress=False)
        waveform = wav_list[0].cpu()
        audio_path = f"static/music_{base_id}.wav"
        torchaudio.save(audio_path, waveform, 32000)

        # Image
        steps = 20 if self.device == "cuda" else 12
        image = self.img_pipe(
            f"High-quality album art, {prompt}, digital art, vibrant, detailed",
            num_inference_steps=steps
        ).images[0]
        image_path = f"static/thumb_{base_id}.png"
        image.save(image_path)

        return {
            "title": clean_title,
            "primary_genre": primary_genre,
            "sub_genres": sub_genres,
            "audio_url": f"/{audio_path}",
            "image_url": f"/{image_path}",
        }


engine = MultiAgentGenerator()
