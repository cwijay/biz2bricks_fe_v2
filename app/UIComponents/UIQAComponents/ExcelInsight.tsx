import React, { useRef, useState } from "react";
import { getSearchResults, getFiles } from "@/app/UILibraries/actions";

interface ExcelInsightProps {
  fileName: string;
  setFileName: (name: string) => void;
  onGenerateInsight?: (file: File) => void;
  onGiveRecommendations?: (file: File) => void;
}

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ExcelInsight.css";
import "./ExcelInsight.css";

const ExcelInsight: React.FC<ExcelInsightProps> = ({ fileName, setFileName, onGenerateInsight, onGiveRecommendations }) => {
  const [error, setError] = useState("");
  const [result, setResult] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [fileSuggestions, setFileSuggestions] = useState<string[]>([]);

  const handleGenerateInsight = async () => {
    setError("");
    setResult("");
    if (!fileName.trim()) {
      setError("Please enter an Excel file name (with .xls or .xlsx extension).");
      return;
    }
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext !== "xls" && ext !== "xlsx") {
      setError("Please enter a valid .xls or .xlsx file name.");
      return;
    }
    const query = "Generate a full page insights from the data in the sheet in a tabular format. Sumamrize the data in key receommndations , trend and actions to be taken";
    setLoadingInsight(true);
    try {
      const res = await getSearchResults(query, fileName.trim());
      let ans = res?.props?.data?.best_result?.answer
        || res?.props?.data?.document_search?.result
        || res?.props?.data?.answer
        || res?.answer
        || res?.data?.answer
        || res?.result?.answer;
      if (!ans) {
        ans = JSON.stringify(res, null, 2);
      }
      setResult(typeof ans === "string" ? ans : String(ans));
    } catch (e) {
      setError("Failed to generate insights.");
    } finally {
      setLoadingInsight(false);
    }
    onGenerateInsight?.(new File([""], fileName.trim()));
  };

  const handleGiveRecommendations = async () => {
    setError("");
    setResult("");
    if (!fileName.trim()) {
      setError("Please enter an Excel file name (with .xls or .xlsx extension).");
      return;
    }
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext !== "xls" && ext !== "xlsx") {
      setError("Please enter a valid .xls or .xlsx file name.");
      return;
    }
    const query = "Give 5 different tables of insight and recommendations based on data in the sheet. Each table must be in valid Markdown table format with headers and rows.";
    setLoadingRecommendation(true);
    try {
      const res = await getSearchResults(query, fileName.trim());
      let ans = res?.props?.data?.best_result?.answer
        || res?.props?.data?.document_search?.result
        || res?.props?.data?.answer
        || res?.answer
        || res?.data?.answer
        || res?.result?.answer;
      if (!ans) {
        ans = JSON.stringify(res, null, 2);
      }
      let resultStr = typeof ans === "string" ? ans : String(ans);
      // Simple post-processing: ensure tables start and end with | and have header separators
      resultStr = resultStr.replace(/\n\s*\|/g, '\n|'); // Remove spaces before table rows
      // Optionally, add more fixes here if needed
      setResult(resultStr);
    } catch (e) {
      setError("Failed to generate recommendations.");
    } finally {
      setLoadingRecommendation(false);
    }
    onGiveRecommendations?.(new File([""], fileName.trim()));
  };

  // Fetch file suggestions for .xls/.xlsx files
  const fetchFileSuggestions = async (query: string) => {
    try {
      const filesResponse = await getFiles("uploaded_files");
      const allFiles: { name: string }[] = filesResponse?.props?.fileData || [];
      const filtered: string[] = allFiles
        .map(f => f.name)
        .filter(name =>
          (name.toLowerCase().endsWith(".xls") || name.toLowerCase().endsWith(".xlsx")) &&
          name.toLowerCase().includes(query.toLowerCase())
        );
      setFileSuggestions(filtered);
    } catch {
      setFileSuggestions([]);
    }
  };

  return (
    <div className="w-full p-4 border rounded bg-white shadow-md flex flex-col gap-4">
      <label className="font-semibold">Excel File Name (.xls or .xlsx):</label>
      <div style={{ position: 'relative', width: 'fit-content' }}>
        <input
          type="text"
          value={fileName}
          onChange={e => {
            setFileName(e.target.value);
            fetchFileSuggestions(e.target.value);
          }}
          placeholder="Enter file name, e.g. salesdata.xlsx"
          className="border rounded p-2 w-64"
          autoComplete="off"
        />
        {/* File name suggestions dropdown */}
        {fileSuggestions.length > 0 && (
          <div className="absolute z-10 bg-white border rounded shadow mt-1 w-64">
            <div className="text-xs text-gray-500 mb-1 px-2 pt-2">Excel file suggestions:</div>
            <ul>
              {fileSuggestions.map((fname) => (
                <li key={fname} className="px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-sm w-full text-left"
                    onClick={() => {
                      setFileName(fname);
                      setFileSuggestions([]);
                    }}
                  >
                    {fname}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {fileName && (
        <div className="text-green-700 text-sm">Entered: {fileName}</div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2">
        <button
          className="text-white px-4 py-1 rounded"
          style={{ backgroundColor: '#e63946' }}
          onClick={handleGenerateInsight}
          disabled={loadingInsight || loadingRecommendation}
        >
          {loadingInsight ? "Loading..." : "Generate Business Insight"}
        </button>
        <button
          className="text-white px-4 py-1 rounded"
          style={{ backgroundColor: '#e63946' }}
          onClick={handleGiveRecommendations}
          disabled={loadingInsight || loadingRecommendation}
        >
          {loadingRecommendation ? "Loading..." : "Give Recommendations"}
        </button>
      </div>
      {result && (
        <div className="mt-4 p-3 bg-gray-50 border rounded text-sm excel-markdown-output" style={{ width: '100%' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ExcelInsight;
