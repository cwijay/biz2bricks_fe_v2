
"use client";


import FAQDocument from "../../../UIComponents/UIQAComponents/FAQDocument";
import FreeTextQA from "../../../UIComponents/UIQAComponents/FreeTextQA";
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function FAQAndQA() {
  const searchParams = useSearchParams();
  const initialFileName = searchParams.get('f') || '';
  const [fileName, setFileName] = useState(initialFileName);

  // Keep fileName in sync with query string
  useEffect(() => {
    setFileName(initialFileName);
  }, [initialFileName]);

  // Callback to update fileName from FAQDocument when Generate FAQ is clicked
  const handleFileNameChange = (name: string) => {
    setFileName(name);
  };

  return (
  <div className="flex flex-col md:flex-row w-full max-w-full m-0 p-0">
      {/* Left: FAQ Documents Section */}
  <div className="md:w-2/3 w-full m-0 p-0">
        <FAQDocument initialFileName={fileName} onGenerateFAQ={handleFileNameChange} />
      </div>
      {/* Right: Free Text QA Section */}
  <div className="md:w-1/3 w-full m-0 p-0">
        <FreeTextQA fileName={fileName} />
      </div>
    </div>
  );
}
