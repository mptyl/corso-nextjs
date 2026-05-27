import HealthStatus from "./components/HealthStatus";
import DocumentList from "./components/DocumentList";
import SearchBar from "./components/SearchBar";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
      <HealthStatus />
      <DocumentList />
      <hr className="my-8" />
      <h2 className="mb-4 text-2xl font-semibold">Cerca nei documenti</h2>
      <SearchBar />
    </main>
  );
}

