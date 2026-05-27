import RistoranteCard from "./components/RistoranteCard"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">RistoranteAI</h1>
      <p className="mt-4 text-lg text-gray-600">
        Il tuo assistente per il menu del ristorante
      </p>
      <div className="mt-8 flex gap-6">
        <RistoranteCard
          titolo="Menu"
          descrizione="Scopri i piatti del nostro ristorante"
        />
        <RistoranteCard
          titolo="Ricette"
          descrizione="Le ricette dei nostri piatti tipici"
        />
        <RistoranteCard
          titolo="Allergeni"
          descrizione="Informazioni su allergeni e intolleranze"
        />
      </div>
    </main>
  )
}
