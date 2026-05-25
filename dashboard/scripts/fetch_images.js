// Fetches artist photos (Deezer) and track album art (iTunes)
// Usage: node scripts/fetch_images.js
// Outputs: src/data/images.json

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../src/data/images.json");

const ARTISTS = [
  // JP
  "Twenty One Pilots", "The 1975", "The Killers", "Gorillaz", "Little Jesus",
  "Muse", "My Chemical Romance", "The Lumineers", "Linkin Park", "Maneskin",
  "Molotov", "Arctic Monkeys", "Childish Gambino", "Imagine Dragons", "Eminem",
  // AR
  "Morat", "Justin Bieber", "Danny Ocean", "TINI", "The Weeknd",
  "Bad Bunny", "One Direction", "Ariana Grande", "Reik", "Cristian Castro",
  "Rauw Alejandro", "Ozuna", "J Balvin", "Sebastian Yatra", "Maluma",
];

const TRACKS = [
  // JP
  { t: "Car Radio", a: "Twenty One Pilots" },
  { t: "Na Na Na", a: "My Chemical Romance" },
  { t: "Robbers", a: "The 1975" },
  { t: "Mi Vida", a: "DLD" },
  { t: "Paladin Strait", a: "Twenty One Pilots" },
  { t: "TQM", a: "Little Jesus" },
  { t: "Knights of Cydonia", a: "Muse" },
  { t: "Welcome to the Black Parade", a: "My Chemical Romance" },
  { t: "Redbone", a: "Childish Gambino" },
  { t: "Psycho", a: "Muse" },
  // AR
  { t: "Déjame Ir", a: "Andrés Cepeda" },
  { t: "Die For You", a: "The Weeknd" },
  { t: "Por Amarte Así", a: "Cristian Castro" },
  { t: "Volver a Amar", a: "Cristian Castro" },
  { t: "Dime tú", a: "Danny Ocean" },
  { t: "Verónica", a: "Cristian Castro" },
  { t: "Labios Compartidos", a: "Maná" },
  { t: "Te Necesito", a: "Cali Y El Dandee" },
  { t: "Amapolas", a: "Leo Rizzi" },
  { t: "Yo Quería", a: "Cristian Castro" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchArtistImage(name) {
  try {
    const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1`;
    const r = await fetch(url);
    const d = await r.json();
    const artist = d.data?.[0];
    if (artist?.picture_big) return artist.picture_big;
    if (artist?.picture_medium) return artist.picture_medium;
  } catch (e) {
    console.warn(`  ✗ Deezer failed for "${name}":`, e.message);
  }
  // Fallback: iTunes song search → album art
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&media=music&entity=song&limit=1`;
    const r = await fetch(url);
    const d = await r.json();
    const art = d.results?.[0]?.artworkUrl100;
    if (art) return art.replace("100x100", "600x600");
  } catch (e) {
    console.warn(`  ✗ iTunes fallback failed for "${name}"`);
  }
  return null;
}

async function fetchTrackImage(track, artist) {
  try {
    const term = `${track} ${artist}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=1`;
    const r = await fetch(url);
    const d = await r.json();
    const art = d.results?.[0]?.artworkUrl100;
    if (art) return art.replace("100x100bb", "300x300bb");
  } catch (e) {
    console.warn(`  ✗ iTunes track failed for "${track}"`);
  }
  return null;
}

async function main() {
  const artists = {};
  const tracks = {};

  console.log("🎨 Fetching artist images from Deezer...");
  for (const name of ARTISTS) {
    process.stdout.write(`  ${name}... `);
    const img = await fetchArtistImage(name);
    artists[name] = img;
    console.log(img ? "✓" : "✗ (none)");
    await sleep(300);
  }

  console.log("\n🎵 Fetching track album art from iTunes...");
  for (const { t, a } of TRACKS) {
    process.stdout.write(`  ${t} — ${a}... `);
    const img = await fetchTrackImage(t, a);
    const key = `${t}|${a}`;
    tracks[key] = img;
    console.log(img ? "✓" : "✗ (none)");
    await sleep(250);
  }

  const out = { artists, tracks };
  writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`\n✅ Saved to ${OUT}`);
  console.log(`   Artists: ${Object.values(artists).filter(Boolean).length}/${ARTISTS.length} found`);
  console.log(`   Tracks:  ${Object.values(tracks).filter(Boolean).length}/${TRACKS.length} found`);
}

main();
