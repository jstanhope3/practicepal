import db from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export default async function RepertoirePage() {
  const cookie = await cookies();
  const userId = cookie.get("user_id")?.value;
  const repertoire = db
    .prepare(
      "Select * FROM repertoire WHERE repertoire.user_id = ? ORDER BY name ASC",
    )
    .all(userId) as any[];

  const concepts = db
    .prepare(
      "SELECT * FROM concepts WHERE concepts.user_id = ? ORDER BY category, name ASC",
    )
    .all(userId) as any[];

  async function addRepertoire(formData: FormData) {
    "use server";

    const cookie = await cookies();
    const userId = cookie.get("user_id")?.value;

    const name = formData.get("name");
    const composer = formData.get("composer");
    const genre = formData.get("genre");
    db.prepare(
      "INSERT INTO repertoire (name, composer, genre, user_id) VALUES (?, ?, ?, ?)",
    ).run(name, composer, genre, userId);
    revalidatePath("/repertoire");
  }

  async function addConcept(formData: FormData) {
    "use server";

    const cookie = await cookies();
    const userId = cookie.get("user_id")?.value;

    const name = formData.get("name");
    const category = formData.get("category");
    db.prepare(
      "INSERT INTO concepts (name, category, user_id) VALUES (?, ?, ?)",
    ).run(name, category, userId);
    revalidatePath("/repertoire");
  }

  async function deleteConcept(formData: FormData) {
    "use server";
    const id = formData.get("id");
    db.prepare("DELETE FROM concepts WHERE id = ?").run(id);
    revalidatePath("/repertoire");
  }

  async function deleteRepertoire(formData: FormData) {
    "use server";
    const id = formData.get("id");
    db.prepare("DELETE FROM repertoire WHERE id = ?").run(id);
    revalidatePath("/repertoire");
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Concepts</h1>
      <form
        action={addConcept}
        className="bg-gray-50 p-4 rounded-lg flex gap-2 mb-8 items-end border"
      >
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Name
          </label>
          <input
            name="name"
            placeholder="e.g. Minor 2-5-1"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="w-40">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Category
          </label>
          <select
            name="category"
            className="w-full p-2 border rounded bg-white"
          >
            <option>General</option>
            <option>Technique</option>
            <option>Improv</option>
            <option>Harmony</option>
          </select>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 h-10">
          Add
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-2">
        {concepts.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center bg-white p-3 border rounded shadow-sm"
          >
            <div>
              <span className="font-bold text-gray-800">{c.name}</span>
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {c.category}
              </span>
            </div>
            <form action={deleteConcept}>
              <input type="hidden" name="id" value={c.id} />
              <button className="text-red-500 hover:text-red-700 text-sm font-semibold">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Repertoire</h1>
      <form
        action={addRepertoire}
        className="bg-gray-50 p-4 rounded-lg flex gap-2 mb-8 items-end border"
      >
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Name
          </label>
          <input
            name="name"
            placeholder="e.g. Autumn Leaves"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Composer
          </label>
          <input
            name="composer"
            placeholder="e.g. Nat King Cole"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="w-40">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Genre
          </label>
          <select name="genre" className="w-full p-2 border rounded bg-white">
            <option>Classical</option>
            <option>Jazz</option>
            <option>Pop</option>
          </select>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 h-10">
          Add
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-2">
        {repertoire.map((r) => (
          <div
            key={r.id}
            className="flex justify-between items-center bg-white p-3 border rounded shadow-sm"
          >
            <div>
              <span className="font-bold text-gray-800">{r.name}</span>

              <span className=" text-gray-800">{r.composer}</span>
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {r.genre}
              </span>
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {r.category}
              </span>
            </div>
            <form action={deleteRepertoire}>
              <input type="hidden" name="id" value={r.id} />
              <button className="text-red-500 hover:text-red-700 text-sm font-semibold">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
