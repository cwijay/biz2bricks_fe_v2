
"use client";
import React from "react";
import FileExplorer from "@/app/UIComponents/UIDocComponents/FileExplorer";

export default function FileExplorerPage() {
  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', margin: 0, padding: 0 }}>
      <main
        className="flex w-full h-screen flex-row bg-white overflow-x-hidden"
        style={{padding: 0, margin: 0, maxWidth: '100vw', overflowX: 'hidden', width: '100%'}}>
        {/* Left navigation should be rendered here if present */}
        <FileExplorer />
      </main>
    </div>
  );
}
