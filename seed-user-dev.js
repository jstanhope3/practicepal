const Database = require("better-sqlite3");
const crypto = require("crypto"); // Needed to hash the username
const db = new Database("practice.db");

console.log("Seeding database for user: practicepal-dev");

const rawUsername = "practicepal-dev";
const userId = crypto.createHash("sha256").update(rawUsername).digest("hex");

db.prepare("INSERT OR IGNORE INTO users (id) VALUES (?)").run(userId);

const concepts = [
  { name: "Major Scales", category: "Technique" },
  { name: "Hanon Exercises", category: "Technique" },
  { name: "ii-V-I Voicings (A & B)", category: "Theory" },
  { name: "Tritone Subs", category: "Theory" },
  { name: "Altered Scale", category: "Improv" },
  { name: "Enclosure Patterns", category: "Improv" },
  { name: "Stride Left Hand", category: "Technique" },
  { name: "Drop-2 Voicings", category: "Theory" },
];

const repertoire = [
  { name: "Autumn Leaves", composer: "Joseph Kosma", genre: "Standard" },
  { name: "Giant Steps", composer: "John Coltrane", genre: "Bebop" },
  { name: "Blue in Green", composer: "Bill Evans", genre: "Ballad" },
  { name: "So What", composer: "Miles Davis", genre: "Modal" },
  {
    name: "All The Things You Are",
    composer: "Jerome Kern",
    genre: "Standard",
  },
  { name: "Donna Lee", composer: "Charlie Parker", genre: "Bebop" },
  { name: "Waltz for Debby", composer: "Bill Evans", genre: "Waltz" },
];

const insertConcept = db.prepare(
  "INSERT INTO concepts (user_id, name, category) VALUES (?, ?, ?)",
);

const conceptMap = [];
concepts.forEach((c) => {
  const info = insertConcept.run(userId, c.name, c.category);
  conceptMap.push(info.lastInsertRowid); // Store the new ID
});

const insertRep = db.prepare(
  "INSERT INTO repertoire (user_id, name, composer, genre) VALUES (?, ?, ?, ?)",
);
const repMap = [];
repertoire.forEach((r) => {
  console.log(userId, r.name, r.composer, r.genre);
  const info = insertRep.run(userId, r.name, r.composer, r.genre);
  repMap.push(info.lastInsertRowid); // Store the new ID
});

const insertLog = db.prepare(`
  INSERT INTO logs (user_id, concept_id, repertoire_id, duration, notes, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function randomDate() {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, 180)); // 0-6 months back
  return date.toISOString();
}

console.log("Injecting 200 fake logs...");

for (let i = 0; i < 200; i++) {
  const hasConcept = Math.random() > 0.2;
  const hasRep = Math.random() > 0.3;

  const conceptId = hasConcept ? random(conceptMap) : null;
  const repId = hasRep ? random(repMap) : null;
  const duration = randomInt(15, 90);

  if (!conceptId && !repId) continue;

  insertLog.run(
    userId,
    conceptId,
    repId,
    duration,
    "Auto-generated practice session",
    randomDate(),
  );
}

console.log("Done! Seeded username: 'practicepal-dev'");
