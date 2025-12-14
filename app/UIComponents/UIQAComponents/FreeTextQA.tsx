import React, { useState } from "react";
import * as XLSX from "xlsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getSearchResults, getFiles } from "@/app/UILibraries/actions";

interface FileObj {
  name: string;
}

interface FreeTextQAProps {
  sourceFile?: string;
  fileName?: string;
}

export default function FreeTextQA({ sourceFile, fileName }: FreeTextQAProps) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qaHistory, setQaHistory] = useState<{ question: string; answer: string }[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setAnswer(null);
    try {
      // Use fileName if provided, else fallback to sourceFile
      const contextFile = fileName || sourceFile;
      const res = await getSearchResults(input, contextFile);
      // Prefer best_result.answer, then document_search.result, then answer, then fallback
      // Robust answer extraction from various possible JSON structures
      let ans = res?.props?.data?.best_result?.answer
        || res?.props?.data?.document_search?.result
        || res?.props?.data?.answer
        || res?.answer
        || res?.data?.answer
        || res?.result?.answer;

      // Fallbacks for more complex or array-based responses
      if (ans === undefined) {
        let candidate = res?.props?.data || res?.answer || res?.data || res?.result || res;
        if (Array.isArray(candidate) && candidate.length > 0) {
          if (typeof candidate[0] === 'object' && candidate[0] !== null && candidate[0].answer) {
            ans = candidate[0].answer;
          } else {
            ans = candidate[0];
          }
        } else if (typeof candidate === 'object' && candidate !== null && Array.isArray(candidate.result)) {
          if (candidate.result.length > 0 && candidate.result[0].answer) {
            ans = candidate.result[0].answer;
          } else {
            ans = candidate.result[0];
          }
        } else if (typeof candidate === 'object' && candidate !== null && candidate.answer) {
          ans = candidate.answer;
        } else if (typeof candidate === 'string') {
          ans = candidate;
        } else {
          ans = JSON.stringify(candidate, null, 2);
        }
      }

      // Extract only the main answer summary block (before any 'explanation', 'source', or metadata), and format for Markdown
      let formattedAns: string = '';
      if (typeof ans === 'string') {
        let cleaned = ans.trim();
        // Remove any repeated question at the start
        if (cleaned.toLowerCase().startsWith(input.trim().toLowerCase())) {
          cleaned = cleaned.slice(input.trim().length).trim();
        }
        // Remove any trailing delimiters (like --- or === or similar)
        cleaned = cleaned.replace(/^[\-=]{2,}|[\-=]{2,}$/gm, '').trim();
        // Extract only the main answer block (before explanation/source/metadata)
        // Look for the first occurrence of a metadata field (case-insensitive)
        const metaMatch = cleaned.match(/([\s\S]*?)(?=\n+((explanation|source|search_strategy|document_search|pandas_agent_search|summary)\s*[:\-]))/i);
        if (metaMatch && metaMatch[1]) {
          cleaned = metaMatch[1].trim();
        }
        formattedAns = cleaned;
      } else if (ans !== undefined && ans !== null) {
        formattedAns = String(ans).trim();
      }
      setAnswer(formattedAns);
      // Add previous Q&A to history
      setQaHistory(prev => [...prev, { question: input, answer: formattedAns }]);
    } catch (e) {
      setError("Failed to fetch answer.");
    } finally {
      setLoading(false);
    }
  };

  // Export answer to Excel
  const handleExportExcel = () => {
    if (!answer) return;
    // Try to parse as Markdown table, else export as plain text
    let ws;
    const tableMatch = answer.match(/\|(.|\n)*\|/g);
    if (tableMatch) {
      // Parse Markdown table
      const lines = answer.split("\n").filter(l => l.trim().startsWith("|"));
      const rows = lines.map(l => l.split("|").slice(1, -1).map(cell => cell.trim()));
      ws = XLSX.utils.aoa_to_sheet(rows);
    } else {
      // Export as single cell text
      ws = XLSX.utils.aoa_to_sheet([[answer]]);
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Answer");
    XLSX.writeFile(wb, "answer.xlsx");
  };

  return (
    <div className="w-full max-w-xl p-4 border rounded bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-2">Ask Anything</h2>
      {fileName && (
        <div className="text-blue-700 text-sm mb-1">Using file: <strong>{fileName}</strong></div>
      )}
      <textarea
        className="w-full border rounded p-2 mb-2 min-h-[80px]"
        placeholder="Type your question or prompt..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="flex gap-2 mb-2">
        <button
          className="text-white px-4 py-1 rounded"
          style={{ backgroundColor: '#e63946' }}
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
        >
          {loading ? "Loading..." : "Generate Response"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          onClick={handleExportExcel}
          disabled={!answer}
        >
          Export to Excel
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {/* Show current answer */}
      {answer && (
        <div className="mt-4">
          <span className="font-semibold">Answer</span>
          <div className="prose bg-gray-100 p-2 rounded text-sm mt-1 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </div>
        </div>
      )}
      {/* Show previous Q&A pairs after current answer */}
      {qaHistory.length > 0 && (
        <div className="mt-4">
          <span className="font-semibold">Previous Q&A</span>
          <div className="space-y-4 mt-2">
            {qaHistory.slice(0, -1).map((qa, idx) => (
              <div key={idx} className="border rounded p-2 bg-gray-50">
                <div className="font-semibold">Q: {qa.question}</div>
                <div className="prose bg-gray-100 p-2 rounded text-sm mt-1 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{qa.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
