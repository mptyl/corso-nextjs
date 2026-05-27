export default function RistoranteCard({
  titolo,
  descrizione,
}: {
  titolo: string
  descrizione: string
}) {
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{titolo}</h2>
      <p className="mt-2 text-gray-600">{descrizione}</p>
    </div>
  )
}
