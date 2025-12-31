import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import ConceptPieChart from "@/app/components/ConceptPieChart";
import RepertoirePieChart from "@/app/components/RepertoirePieChart";
import DateFilter from "@/app/components/DateFilter";
import Card from "@/app/components/Card";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{ range?: string }>;
};

export default async function Dashboard(props: Props) {
  const cookie = await cookies();
  const userId = cookie.get("user_id")?.value;

  const searchParams = await props.searchParams;
  const range = searchParams.range || "7";

  const dateFilter =
    range !== "all"
      ? `AND logs.timestamp >= datetime('now', '-${range} days')`
      : "";

  const concepts = db
    .prepare(
      `
      SELECT
        *
      FROM
        concepts
      WHERE concepts.user_id = ?
      ORDER BY name ASC
    `,
    )
    .all(userId) as any[];

  const repertoire = db
    .prepare(
      "SELECT * FROM repertoire WHERE repertoire.user_id = ? ORDER BY name ASC",
    )
    .all(userId) as any[];
  const stats = db
    .prepare(
      `
    SELECT
      count(*) as recorded_sessions,
      coalesce(sum(duration), 0) as total_minutes
    FROM logs
    WHERE logs.user_id = ? ${dateFilter}
  `,
    )
    .get(userId) as any;

  const chartData = db
    .prepare(
      `
      SELECT
        COALESCE(concepts.name, 'No Concept') as name,
        COALESCE(concepts.category, 'Unspecified') as category,
        SUM(logs.duration) as value
      FROM logs
      JOIN concepts ON logs.concept_id = concepts.id
      WHERE logs.user_id = ? ${dateFilter}
      GROUP BY concepts.name, concepts.category
      ORDER BY value DESC
    `,
    )
    .all(userId);

  const pieceData = db
    .prepare(
      `
      SELECT
        COALESCE(repertoire.name, 'No Concept') as name,
        SUM(logs.duration) as value
      FROM logs
      JOIN repertoire ON logs.repertoire_id = repertoire.id
      WHERE logs.user_id = ? ${dateFilter}
      GROUP BY repertoire.name
      ORDER BY value DESC
    `,
    )
    .all(userId);

  async function logSession(formData: FormData) {
    "use server";
    const cookie = await cookies();
    const rawConcept = formData.get("concept_id");
    const conceptId = rawConcept ? rawConcept : null;
    const rawRepertoire = formData.get("repertoire_id");
    const repertoireId = rawRepertoire ? rawRepertoire : null;
    const duration = formData.get("duration");
    const notes = formData.get("notes");
    const user_id = cookie.get("user_id")?.value;

    const stmt = db.prepare(
      "INSERT INTO logs (user_id, concept_id, repertoire_id, duration, notes ) VALUES (?, ?, ?, ?, ?)",
    );
    stmt.run(user_id, conceptId, repertoireId, duration, notes);
    revalidatePath("/");
  }

  return (
    <main className="bg-practicepal-100 max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-practicepal-400">
            Dashboard
          </h1>
        </div>
        <DateFilter />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="bg-practicepal-100 p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-practicepal-400 mb-4">
            Practice Time per Concept
          </h3>

          <ConceptPieChart data={chartData} />
        </div>
        <div className="bg-practicepal-100 p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-practicepal-400 mb-4">
            Practice Time per Piece
          </h3>

          <RepertoirePieChart data={pieceData} />
        </div>
      </div>

      <section className="bg-practicepal-100 p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Record Session</h2>
        <form action={logSession} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Concept</label>
              <select
                name="concept_id"
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">None</option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Repertoire
              </label>
              <select
                name="repertoire_id"
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">None</option>
                {repertoire.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (min)
              </label>
              <input
                name="duration"
                type="number"
                placeholder="30"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input
              name="notes"
              type="text"
              placeholder="Brief notes..."
              className="w-full p-2 border rounded"
            />
          </div>
          <button className="bg-practicepal-200 text-pra px-6 py-2 rounded font-bold hover:bg-practicepal-500 w-full md:w-auto">
            Log Session
          </button>
        </form>
      </section>
    </main>
  );
}
