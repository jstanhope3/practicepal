import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function LogsPage() {
  const cookie = await cookies();
  const userId = cookie.get("user_id")?.value;

  const logs = db
    .prepare(
      `
      SELECT
        logs.id,
        logs.timestamp,
        logs.duration,
        logs.notes,
        COALESCE(concepts.name, 'None') as concept_name,
        COALESCE(repertoire.name, 'None') as repertoire_name
      FROM logs
      LEFT JOIN concepts ON logs.concept_id = concepts.id
      LEFT JOIN repertoire ON logs.repertoire_id = repertoire.id
      WHERE logs.user_id = ?
      ORDER BY logs.timestamp DESC
    `,
    )
    .all(userId) as any[];

  async function deleteLog(formData: FormData) {
    "use server";
    const id = formData.get("id");
    db.prepare("DELETE FROM logs WHERE id = ?").run(id);
    revalidatePath("/logs");
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Practice History</h1>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Concept</th>
              <th className="p-4">Repertoire</th>
              <th className="p-4">Time</th>
              <th className="p-4">Notes</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleDateString()}{" "}
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4 font-bold text-gray-800">
                  {log.concept_name}
                </td>
                <td className="p-4 font-bold text-gray-800">
                  {log.repertoire_name}
                </td>
                <td className="p-4">{log.duration}m</td>
                <td className="p-4 text-gray-600 text-sm">{log.notes}</td>
                <td className="p-4">
                  <form action={deleteLog}>
                    <input type="hidden" name="id" value={log.id} />
                    <button className="text-red-500 hover:text-red-700 text-sm font-bold">
                      X
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
