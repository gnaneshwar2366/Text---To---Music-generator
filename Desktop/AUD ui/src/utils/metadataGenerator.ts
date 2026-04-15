export interface SongMetadata {
  title: string;
  genre: string;
}

const titleWords = {
  dark: [
    "Shadow", "Grim", "Abyss", "Nocturnal", "Midnight", "Eclipse", "Obsidian", "Phantom", "Noir", "Raven",
    "Twilight", "Dusk", "Void", "Enigma", "Sinister", "Cryptic", "Murky", "Gloom", "Shroud", "Veiled",
    "Umbra", "Tenebrous", "Obscure", "Haze", "Fog", "Mist", "Bleak", "Somber", "Grave", "Solemn",
    "Melancholy", "Mourning", "Elegy", "Requiem", "Dirge", "Lament", "Sorrow", "Woe", "Anguish", "Torment",
    "Despair", "Desolate", "Forsaken", "Abandoned", "Lost", "Forgotten", "Buried", "Hidden", "Secret", "Mystery",
    "Onyx", "Coal", "Ebony", "Charcoal", "Slate", "Sable", "Jet", "Ink", "Pitch", "Carbon",
    "Eternal", "Infinite", "Endless", "Perpetual", "Timeless", "Ancient", "Primal", "Primordial", "Origin", "Genesis",
    "Doom", "Fate", "Destiny", "Prophecy", "Oracle", "Vision", "Dream", "Nightmare", "Terror", "Fear",
    "Dread", "Horror", "Macabre", "Morbid", "Gothic", "Victorian", "Medieval", "Renaissance", "Baroque", "Classical",
    "Subterranean", "Underground", "Crypt", "Catacomb", "Dungeon", "Fortress", "Castle", "Tower", "Keep", "Citadel"
  ],
  epic: [
    "Legend", "Crest", "Apex", "Vanguard", "Empire", "Titan", "Colossus", "Leviathan", "Behemoth", "Goliath",
    "Champion", "Warrior", "Gladiator", "Sentinel", "Guardian", "Protector", "Defender", "Knight", "Paladin", "Crusader",
    "Hero", "Victor", "Conqueror", "Vanquisher", "Triumphant", "Glorious", "Majestic", "Sovereign", "Regal", "Royal",
    "Imperial", "Celestial", "Divine", "Sacred", "Holy", "Blessed", "Sanctified", "Hallowed", "Consecrated", "Anointed",
    "Mountain", "Peak", "Summit", "Pinnacle", "Zenith", "Acme", "Crown", "Throne", "Dynasty", "Reign",
    "Kingdom", "Dominion", "Realm", "Territory", "Domain", "Province", "Region", "Land", "Nation", "State",
    "Odyssey", "Journey", "Quest", "Voyage", "Expedition", "Adventure", "Saga", "Chronicle", "Tale", "Story",
    "Eternal", "Immortal", "Everlasting", "Undying", "Ageless", "Timeless", "Perpetual", "Infinite", "Boundless", "Limitless",
    "Phoenix", "Dragon", "Griffin", "Unicorn", "Pegasus", "Hydra", "Kraken", "Minotaur", "Centaur", "Cyclops",
    "Olympus", "Valhalla", "Asgard", "Elysium", "Paradise", "Heaven", "Nirvana", "Utopia", "Shangri-La", "Eden"
  ],
  chill: [
    "Vibe", "Lofi", "Aura", "Ether", "Serenity", "Tranquil", "Peaceful", "Calm", "Mellow", "Gentle",
    "Soft", "Smooth", "Silky", "Velvet", "Satin", "Silk", "Cotton", "Linen", "Cashmere", "Fleece",
    "Breeze", "Wind", "Zephyr", "Gust", "Draft", "Current", "Flow", "Stream", "River", "Creek",
    "Dawn", "Morning", "Sunrise", "Daybreak", "Aurora", "Twilight", "Evening", "Sunset", "Dusk", "Gloaming",
    "Cloud", "Sky", "Azure", "Cerulean", "Sapphire", "Indigo", "Cobalt", "Navy", "Royal", "Powder",
    "Dream", "Reverie", "Fantasy", "Vision", "Illusion", "Mirage", "Hallucination", "Delusion", "Imagination", "Thought",
    "Ambient", "Atmosphere", "Mood", "Tone", "Feel", "Sense", "Touch", "Caress", "Stroke", "Brush",
    "Float", "Drift", "Hover", "Glide", "Soar", "Fly", "Sail", "Coast", "Cruise", "Wander",
    "Zen", "Yoga", "Meditation", "Mindful", "Aware", "Present", "Conscious", "Lucid", "Clear", "Pure",
    "Nature", "Organic", "Natural", "Earth", "Terra", "Gaia", "Green", "Eco", "Bio", "Life"
  ],
  rap: [
    "Grind", "Street", "Cipher", "Hustle", "Rhyme", "Flow", "Bars", "Beats", "Bass", "808",
    "Trap", "Boom", "Bap", "Snap", "Clap", "Kick", "Snare", "Hi-Hat", "Drum", "Rhythm",
    "Hood", "Block", "Corner", "Avenue", "Boulevard", "Lane", "Alley", "Road", "Path", "Way",
    "Money", "Cash", "Paper", "Bread", "Dough", "Cheese", "Guap", "Bands", "Stacks", "Racks",
    "King", "Boss", "Chief", "Head", "Top", "Alpha", "Prime", "First", "Number", "One",
    "Real", "True", "Authentic", "Genuine", "Legit", "Solid", "Valid", "Certified", "Official", "Verified",
    "Raw", "Uncut", "Pure", "Clean", "Fresh", "New", "Original", "Unique", "Exclusive", "Limited",
    "Hard", "Tough", "Strong", "Powerful", "Mighty", "Force", "Energy", "Power", "Strength", "Muscle",
    "Swag", "Style", "Fashion", "Drip", "Fit", "Outfit", "Look", "Aesthetic", "Vibe", "Aura",
    "Crown", "Throne", "Empire", "Dynasty", "Legacy", "Heritage", "History", "Past", "Present", "Future"
  ],
  boss: [
    "Overlord", "Rival", "Doom", "Victory", "Throne", "Conqueror", "Supreme", "Ultimate", "Final", "Last",
    "Battle", "War", "Fight", "Combat", "Conflict", "Struggle", "Clash", "Duel", "Showdown", "Confrontation",
    "Power", "Force", "Strength", "Might", "Energy", "Intensity", "Fury", "Rage", "Wrath", "Anger",
    "Strike", "Attack", "Assault", "Charge", "Rush", "Blitz", "Raid", "Invasion", "Siege", "Storm",
    "Thunder", "Lightning", "Bolt", "Flash", "Spark", "Flame", "Fire", "Blaze", "Inferno", "Pyre",
    "Steel", "Iron", "Metal", "Blade", "Sword", "Saber", "Katana", "Scimitar", "Rapier", "Cutlass",
    "Havoc", "Chaos", "Mayhem", "Pandemonium", "Bedlam", "Turmoil", "Disorder", "Confusion", "Anarchy", "Riot",
    "Vendetta", "Revenge", "Retribution", "Vengeance", "Payback", "Retaliation", "Reprisal", "Comeuppance", "Justice", "Judgment",
    "Savage", "Brutal", "Fierce", "Ruthless", "Merciless", "Relentless", "Unstoppable", "Invincible", "Unbeatable", "Indomitable",
    "Rampage", "Onslaught", "Barrage", "Volley", "Salvo", "Bombardment", "Cannonade", "Fusillade", "Hail", "Shower"
  ],
  electronic: [
    "Pulse", "Wave", "Signal", "Frequency", "Oscillate", "Resonance", "Vibration", "Modulation", "Synthesis", "Digital",
    "Circuit", "Wire", "Current", "Voltage", "Charge", "Electron", "Particle", "Atom", "Quantum", "Nano",
    "Neon", "Laser", "LED", "Pixel", "Screen", "Display", "Monitor", "Interface", "Terminal", "Console",
    "Cyber", "Tech", "Matrix", "Grid", "Network", "System", "Program", "Code", "Algorithm", "Data",
    "Chrome", "Silicon", "Titanium", "Platinum", "Silver", "Gold", "Copper", "Bronze", "Brass", "Aluminum",
    "Future", "Tomorrow", "Next", "Advanced", "Modern", "Contemporary", "Current", "Present", "Now", "Today",
    "Velocity", "Speed", "Fast", "Quick", "Rapid", "Swift", "Hasty", "Brisk", "Prompt", "Instant",
    "Strobe", "Flash", "Blink", "Flicker", "Pulse", "Beat", "Tick", "Click", "Tap", "Hit",
    "Spectrum", "Range", "Span", "Scope", "Scale", "Gamut", "Array", "Series", "Sequence", "Pattern",
    "Gravity", "Orbit", "Satellite", "Lunar", "Solar", "Stellar", "Cosmic", "Galactic", "Universal", "Celestial"
  ],
  orchestral: [
    "Symphony", "Concerto", "Sonata", "Prelude", "Overture", "Suite", "Movement", "Opus", "Etude", "Nocturne",
    "Allegro", "Adagio", "Andante", "Largo", "Presto", "Vivace", "Moderato", "Lento", "Grave", "Maestoso",
    "Strings", "Brass", "Woodwind", "Percussion", "Orchestra", "Ensemble", "Quartet", "Quintet", "Sextet", "Septet",
    "Violin", "Viola", "Cello", "Bass", "Harp", "Piano", "Forte", "Grand", "Majestic", "Noble",
    "Royal", "Imperial", "Regal", "Sovereign", "Dignified", "Stately", "Elegant", "Refined", "Graceful", "Poised",
    "Hall", "Theatre", "Opera", "Stage", "Performance", "Concert", "Recital", "Show", "Presentation", "Exhibition",
    "Baroque", "Classical", "Romantic", "Modern", "Contemporary", "Traditional", "Vintage", "Antique", "Ancient", "Historic",
    "Crescendo", "Diminuendo", "Fortissimo", "Pianissimo", "Sforzando", "Legato", "Staccato", "Pizzicato", "Tremolo", "Vibrato",
    "Harmony", "Melody", "Chord", "Note", "Pitch", "Tone", "Timbre", "Resonance", "Acoustics", "Sound",
    "Majesty", "Grandeur", "Splendor", "Glory", "Magnificence", "Brilliance", "Radiance", "Luster", "Shine", "Glow"
  ]
};

const musicalTerms = [
  "Sequence", "Composition", "Arrangement", "Production", "Mix", "Master", "Track", "Loop", "Sample", "Beat",
  "Melody", "Harmony", "Rhythm", "Tempo", "Groove", "Riff", "Hook", "Chorus", "Verse", "Bridge",
  "Intro", "Outro", "Breakdown", "Buildup", "Drop", "Transition", "Fill", "Run", "Scale", "Chord",
  "Progression", "Cadence", "Resolution", "Tension", "Release", "Dynamics", "Texture", "Layer", "Sound", "Tone",
  "Vibe", "Feel", "Energy", "Mood", "Atmosphere", "Ambience", "Space", "Depth", "Width", "Height",
  "Movement", "Motion", "Flow", "Wave", "Pulse", "Drive", "Push", "Pull", "Swing", "Bounce",
  "Journey", "Voyage", "Path", "Way", "Road", "Trail", "Route", "Course", "Direction", "Destination",
  "Dream", "Vision", "Fantasy", "Illusion", "Mirage", "Echo", "Reverb", "Delay", "Distortion", "Effect",
  "Session", "Take", "Cut", "Edit", "Version", "Remix", "Mashup", "Bootleg", "Edit", "Dub",
  "Original", "Classic", "Anthem", "Banger", "Hit", "Smash", "Jam", "Vibe", "Tune", "Track"
];

const genreDescriptors = {
  hiphop: [
    "Hip-Hop", "Rap", "Trap", "Boom-Bap", "Drill", "Gangsta Rap", "Conscious Hip-Hop", "Alternative Hip-Hop",
    "East Coast Hip-Hop", "West Coast Hip-Hop", "Southern Hip-Hop", "Midwest Hip-Hop", "Underground Hip-Hop",
    "Cloud Rap", "Emo Rap", "Mumble Rap", "Jazz Rap", "Abstract Hip-Hop", "Experimental Hip-Hop", "Lo-Fi Hip-Hop",
    "Gritty East Coast", "G-Funk", "Hyphy", "Crunk", "Snap", "Miami Bass", "Horrorcore", "Nerdcore",
    "Mafioso Rap", "Hardcore Hip-Hop", "Political Hip-Hop", "Spiritual Hip-Hop", "Party Rap", "Street Rap",
    "Old School Hip-Hop", "New School Hip-Hop", "Golden Age Hip-Hop", "Contemporary Hip-Hop", "Progressive Hip-Hop"
  ],
  electronic: [
    "Electronic", "EDM", "House", "Techno", "Trance", "Dubstep", "Drum and Bass", "Breakbeat",
    "Ambient", "IDM", "Downtempo", "Chillwave", "Synthwave", "Vaporwave", "Future Bass", "Glitch",
    "Electro", "Electronica", "Progressive House", "Deep House", "Tech House", "Acid House", "Chicago House",
    "Detroit Techno", "Berlin Techno", "Minimal Techno", "Industrial", "EBM", "Darkwave", "Cyberpunk",
    "Neurofunk", "Liquid Funk", "Jump-Up", "Jungle", "UK Garage", "2-Step", "Grime", "Bassline",
    "Hardstyle", "Hardcore", "Gabber", "Happy Hardcore", "Psytrance", "Goa Trance", "Progressive Trance",
    "Melodic House", "Organic House", "Afro House", "Tribal House", "Funky House", "Disco House"
  ],
  orchestral: [
    "Orchestral", "Cinematic", "Epic Orchestral", "Film Score", "Soundtrack", "Classical", "Baroque",
    "Romantic Classical", "Modern Classical", "Neo-Classical", "Chamber Music", "Symphonic", "Operatic",
    "Choral", "Sacred Music", "Liturgical", "Requiem", "Mass", "Cantata", "Oratorio", "Passion",
    "String Quartet", "Piano Concerto", "Violin Concerto", "Symphonic Poem", "Tone Poem", "Overture",
    "Movie Score", "Video Game Score", "Trailer Music", "Epic Music", "Dramatic Orchestral", "Fantasy Score",
    "Adventure Score", "Action Score", "Emotional Orchestral", "Inspirational Orchestral", "Dark Orchestral",
    "Hybrid Orchestral", "Orchestral Electronic", "Cinematic Trailer", "Epic Trailer", "Dramatic Trailer"
  ],
  chill: [
    "Lofi", "Chillhop", "Chillout", "Downtempo", "Ambient", "Atmospheric", "Relaxing", "Meditation",
    "Yoga Music", "Spa Music", "Healing", "Therapeutic", "Calming", "Peaceful", "Tranquil", "Serene",
    "Lo-Fi Beats", "Study Beats", "Sleep Music", "Background Music", "Elevator Music", "Smooth Jazz",
    "Bossa Nova", "Cool Jazz", "Mellow", "Soft", "Gentle", "Easy Listening", "Acoustic Chill",
    "Indie Folk", "Neo-Soul", "R&B Chill", "Trip-Hop", "Lazy Hip-Hop", "Jazz-Hop", "Soul-Hop",
    "Nature Sounds", "Rain Sounds", "Ocean Waves", "Forest Ambience", "White Noise", "Brown Noise",
    "Binaural Beats", "ASMR", "Soundscape", "Drone", "Minimalist", "Post-Rock", "Slowcore"
  ],
  rock: [
    "Rock", "Alternative Rock", "Indie Rock", "Hard Rock", "Metal", "Heavy Metal", "Thrash Metal",
    "Death Metal", "Black Metal", "Doom Metal", "Sludge Metal", "Stoner Metal", "Progressive Metal",
    "Nu Metal", "Metalcore", "Deathcore", "Grindcore", "Post-Metal", "Djent", "Math Metal",
    "Classic Rock", "Blues Rock", "Southern Rock", "Arena Rock", "Stadium Rock", "Glam Rock",
    "Punk Rock", "Pop Punk", "Skate Punk", "Hardcore Punk", "Post-Punk", "New Wave", "Gothic Rock",
    "Psychedelic Rock", "Stoner Rock", "Desert Rock", "Garage Rock", "Surf Rock", "Rockabilly",
    "Progressive Rock", "Art Rock", "Experimental Rock", "Noise Rock", "Post-Rock", "Math Rock"
  ],
  jazz: [
    "Jazz", "Bebop", "Hard Bop", "Cool Jazz", "Modal Jazz", "Free Jazz", "Avant-Garde Jazz",
    "Smooth Jazz", "Contemporary Jazz", "Fusion", "Jazz Fusion", "Latin Jazz", "Afro-Cuban Jazz",
    "Swing", "Big Band", "Dixieland", "Ragtime", "New Orleans Jazz", "Chicago Jazz", "Kansas City Jazz",
    "Gypsy Jazz", "Manouche", "Jazz Funk", "Soul Jazz", "Acid Jazz", "Nu Jazz", "Electronic Jazz",
    "Spiritual Jazz", "Post-Bop", "Third Stream", "Chamber Jazz", "Vocal Jazz", "Jazz Blues",
    "Crossover Jazz", "World Fusion", "Jazz-Rock", "Progressive Jazz", "Experimental Jazz"
  ]
};

export function generateAIMetadata(prompt: string): SongMetadata {
  const p = prompt.toLowerCase();

  let titleParts: string[] = [];
  let genres: string[] = [];

  if (p.includes("rap") || p.includes("hip hop") || p.includes("hip-hop") || p.includes("trap") || p.includes("drill")) {
    titleParts.push(titleWords.rap[Math.floor(Math.random() * titleWords.rap.length)]);
    titleParts.push(titleWords.boss[Math.floor(Math.random() * titleWords.boss.length)]);

    if (p.includes("dark") || p.includes("gritty") || p.includes("mafia") || p.includes("mafioso")) {
      genres.push(genreDescriptors.hiphop[8]);
      genres.push("Cinematic Mafioso Rap");
      genres.push(genreDescriptors.hiphop[5]);
    } else if (p.includes("boom") || p.includes("bap") || p.includes("90s")) {
      genres.push(genreDescriptors.hiphop[3]);
      genres.push(genreDescriptors.hiphop[8]);
    } else if (p.includes("trap")) {
      genres.push(genreDescriptors.hiphop[2]);
      genres.push("Modern Trap");
    } else {
      genres.push(genreDescriptors.hiphop[Math.floor(Math.random() * genreDescriptors.hiphop.length)]);
      genres.push(genreDescriptors.hiphop[Math.floor(Math.random() * genreDescriptors.hiphop.length)]);
    }
  } else if (p.includes("orchestral") || p.includes("cinematic") || p.includes("epic") || p.includes("movie") || p.includes("film")) {
    titleParts.push(titleWords.epic[Math.floor(Math.random() * titleWords.epic.length)]);
    titleParts.push(titleWords.orchestral[Math.floor(Math.random() * titleWords.orchestral.length)]);

    genres.push(genreDescriptors.orchestral[1]);
    genres.push(genreDescriptors.orchestral[2]);
    if (p.includes("dark")) {
      genres.push("Dark Orchestral");
    }
  } else if (p.includes("lofi") || p.includes("chill") || p.includes("relax") || p.includes("study")) {
    titleParts.push(titleWords.chill[Math.floor(Math.random() * titleWords.chill.length)]);
    titleParts.push(titleWords.chill[Math.floor(Math.random() * titleWords.chill.length)]);

    genres.push(genreDescriptors.chill[0]);
    genres.push(genreDescriptors.chill[1]);
    genres.push(genreDescriptors.chill[3]);
  } else if (p.includes("electronic") || p.includes("edm") || p.includes("house") || p.includes("techno") || p.includes("synth")) {
    titleParts.push(titleWords.electronic[Math.floor(Math.random() * titleWords.electronic.length)]);
    titleParts.push(titleWords.electronic[Math.floor(Math.random() * titleWords.electronic.length)]);

    genres.push(genreDescriptors.electronic[Math.floor(Math.random() * 10)]);
    genres.push(genreDescriptors.electronic[Math.floor(Math.random() * 10)]);
  } else if (p.includes("rock") || p.includes("metal") || p.includes("guitar")) {
    titleParts.push(titleWords.boss[Math.floor(Math.random() * titleWords.boss.length)]);
    titleParts.push(musicalTerms[Math.floor(Math.random() * 20)]);

    genres.push(genreDescriptors.rock[Math.floor(Math.random() * genreDescriptors.rock.length)]);
  } else if (p.includes("jazz")) {
    titleParts.push(titleWords.chill[Math.floor(Math.random() * titleWords.chill.length)]);
    titleParts.push(musicalTerms[Math.floor(Math.random() * musicalTerms.length)]);

    genres.push(genreDescriptors.jazz[Math.floor(Math.random() * genreDescriptors.jazz.length)]);
  } else if (p.includes("dark") || p.includes("scary") || p.includes("horror")) {
    titleParts.push(titleWords.dark[Math.floor(Math.random() * titleWords.dark.length)]);
    titleParts.push(titleWords.dark[Math.floor(Math.random() * titleWords.dark.length)]);

    genres.push("Dark Ambient");
    genres.push("Atmospheric");
    genres.push("Experimental");
  } else if (p.includes("battle") || p.includes("boss") || p.includes("fight")) {
    titleParts.push(titleWords.epic[Math.floor(Math.random() * titleWords.epic.length)]);
    titleParts.push(titleWords.boss[Math.floor(Math.random() * titleWords.boss.length)]);

    genres.push("Epic Battle");
    genres.push("Cinematic Action");
  } else {
    const words = prompt.split(" ").filter(w => w.length > 3);
    if (words.length >= 2) {
      titleParts.push(words[0].charAt(0).toUpperCase() + words[0].slice(1));
      titleParts.push(words[1].charAt(0).toUpperCase() + words[1].slice(1));
    } else if (words.length === 1) {
      titleParts.push(words[0].charAt(0).toUpperCase() + words[0].slice(1));
      titleParts.push(musicalTerms[Math.floor(Math.random() * musicalTerms.length)]);
    } else {
      titleParts.push("Alpha");
      titleParts.push(musicalTerms[Math.floor(Math.random() * musicalTerms.length)]);
    }

    genres.push("Experimental AI");
    genres.push("Generative Sound");
  }

  const title = titleParts.join(" ").toUpperCase();
  const genre = Array.from(new Set(genres)).join(" • ");

  return { title, genre };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
