import HealthStatus from "./components/HealthStatus";
import DocumentList from "./components/DocumentList";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
      <HealthStatus />
      <DocumentList />
    </main>
  );
}
