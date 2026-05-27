"use client";

import { useEffect, useState } from "react";

interface Document {
  name: string;
  path: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function fetchDocuments() {
      const res = await fetch("http://127.0.0.1:8000/api/documents");
      const json = await res.json();
      setDocuments(json.documents);
    }
    fetchDocuments();
  }, []);

  if (documents.length === 0) return <p>Nessun documento trovato.</p>;

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Documenti disponibili</h2>
      <ul className="list-inside list-disc space-y-1">
        {documents.map((doc) => (
          <li key={doc.name} className="text-gray-700">{doc.name}</li>
        ))}
      </ul>
    </div>
  );
}
