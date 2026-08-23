"use client";

import * as React from "react";
import { DocumentPanel } from "@/components/hr-dashboard/documents/document-panel";
import { DocumentList } from "@/components/hr-dashboard/documents/document-list";

export default function DocumentsPage() {
  const [activeCategoryId, setActiveCategoryId] = React.useState("my-documents");

  return (
    <>
      <DocumentPanel
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
        <DocumentList activeCategoryId={activeCategoryId} />
      </main>
    </>
  );
}
