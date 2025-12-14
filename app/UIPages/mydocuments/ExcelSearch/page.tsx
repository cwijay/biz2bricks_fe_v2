"use client";
import React, { useState } from "react";
import ExcelInsight from "../../../UIComponents/UIQAComponents/ExcelInsight";
import FreeTextQA from "../../../UIComponents/UIQAComponents/FreeTextQA";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ExcelSearchPage() {
  const [fileName, setFileName] = useState("");
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Excel Business Insights & Recommendations</h1>
      <div className="flex flex-row gap-6 w-full">
        <div className="w-1/2">
          <ExcelInsight fileName={fileName} setFileName={setFileName} />
        </div>
        <div className="w-1/2">
          <FreeTextQA fileName={fileName} />
        </div>
      </div>
    </div>
  );
}
