import { ChatProvider } from "./contexts/ChatContext";
import ChatComponent from "./components/ChatComponent";
import DocumentList from "./components/DocumentList";
import HealthStatus from "./components/HealthStatus";

export default function Home() {
  return (
    <ChatProvider>
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
        <div className="mb-6 flex gap-4">
          <HealthStatus />
          <DocumentList />
        </div>
        <ChatComponent />
      </main>
    </ChatProvider>
  );
}


