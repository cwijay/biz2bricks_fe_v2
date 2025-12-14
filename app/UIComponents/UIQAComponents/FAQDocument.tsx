"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateDocumentPrompts, getSearchResults, getFiles } from "@/app/UILibraries/actions";

interface FAQDocumentProps {
  initialFileName?: string;
  onGenerateFAQ?: (name: string) => void;
}

const FAQDocument = ({ initialFileName = "", onGenerateFAQ }: FAQDocumentProps) => {
  const [fileName, setFileName] = useState(initialFileName);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  // Always sync fileName with initialFileName from props unless user has typed
  useEffect(() => {
    setFileName(initialFileName);
    setHasAutoSearched(false);
  }, [initialFileName]);

  // On mount, if initialFileName is present, call generate prompt once
  useEffect(() => {
    if (initialFileName) {
      handleFetchFAQs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove auto-generate FAQ on fileName change. Only generate on button click.
  const [fileSuggestions, setFileSuggestions] = useState<string[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  // List all file names and show close matches to user input
  const fetchFileSuggestions = async (query: string) => {
    setSuggestionLoading(true);
    try {
      const filesResponse = await getFiles("uploaded_files");
      const allFiles: { name: string }[] = filesResponse?.props?.fileData || [];
      const filtered: string[] = allFiles
        .map(f => f.name)
        .filter(name => name.toLowerCase().includes(query.toLowerCase()));
      setFileSuggestions(filtered);
    } catch {
      setFileSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  };
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [answerLoading, setAnswerLoading] = useState<{ [key: number]: boolean }>({});
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const handleFetchFAQs = async () => {
    setLoading(true);
    setError("");
    setAnswers({});
    setAnswerLoading({});
    setExpanded({});
    try {
      const result = await generateDocumentPrompts(fileName);
      setRawResponse(result);
      // Only handle JSON list (array) of questions
      let questions = result?.props?.data?.questions;
      let questionList: string[] = [];
      if (Array.isArray(questions)) {
        questionList = questions;
      } else if (typeof questions === "string") {
        try {
          const parsed = JSON.parse(questions);
          if (Array.isArray(parsed)) {
            questionList = parsed;
          }
        } catch {
          // Not JSON, fallback: treat as empty
          questionList = [];
        }
      } else if (Array.isArray(result?.props?.data)) {
        questionList = result.props.data;
      } else if (Array.isArray(result)) {
        questionList = result;
      }
      setFaqs(questionList);
      if (!questionList.length) {
        setError("No questions found. Please check if the file exists and contains content for generating questions.");
      }
    } catch (err: any) {
      setError("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-16 p-4 max-w-6xl mx-auto">
      {/* Left: FAQ Section */}
      <div className="md:w-2/3 w-full">
        <h1 className="text-2xl font-bold mb-4">Document FAQ Generator</h1>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            className="border px-2 py-1 flex-1"
            placeholder="Enter file name..."
            value={fileName}
            onChange={e => {
              const newValue = e.target.value;
              setFileName(newValue);
              setHasAutoSearched(false);
              // Only fire fetchFileSuggestions if user is typing (not from query string)
              if (newValue !== initialFileName) {
                fetchFileSuggestions(newValue);
              }
            }}
            autoComplete="off"
          />
          {/* File name suggestions dropdown */}
          {(suggestionLoading || fileSuggestions.length > 0) && (
            <div className="absolute z-10 bg-white border rounded shadow mt-12 w-1/2">
              <div className="flex justify-between items-center px-2 pt-2">
                <span className="text-xs text-gray-500 mb-1">File name suggestions:</span>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold px-2"
                  onClick={() => { setFileSuggestions([]); setSuggestionLoading(false); }}
                  aria-label="Close suggestions"
                >
                  &times;
                </button>
              </div>
              {suggestionLoading ? (
                <div className="px-2 py-2 text-gray-500 text-sm">Loading...</div>
              ) : (
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
              )}
            </div>
          )}
          <button
            className="text-white px-4 py-1 rounded"
            style={{ backgroundColor: '#e63946' }}
            onClick={() => {
              if (onGenerateFAQ) onGenerateFAQ(fileName);
              handleFetchFAQs();
            }}
            disabled={loading || !fileName}
          >
            {loading ? "Loading..." : "Generate FAQ"}
          </button>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div>
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((question, idx) => (
              <div key={idx} className="border rounded p-3 bg-gray-50">
                <button
                  className="font-semibold text-left w-full hover:underline focus:outline-none"
                  onClick={async () => {
                    const isOpen = !!expanded[idx + 1];
                    if (isOpen) {
                      setExpanded(exp => ({ ...exp, [idx + 1]: false }));
                      return;
                    }
                    setExpanded(exp => ({ ...exp, [idx + 1]: true }));
                    if (!answers[idx + 1] && !answerLoading[idx + 1]) {
                      setAnswerLoading(al => ({ ...al, [idx + 1]: true }));
                      try {
                        const res = await getSearchResults(question, fileName);
                        let result = res?.props?.data?.document_search?.result;
                        // Fallbacks as before
                        if (!result && res?.props?.data?.best_result?.answer) {
                          result = res.props.data.best_result.answer;
                        }
                        // If still no result, fallback to a generic message
                        if (!result) {
                          result = "No answer found.";
                        }
                        // If result is not a string, stringify it
                        if (typeof result !== 'string') {
                          result = JSON.stringify(result, null, 2);
                        }
                        setAnswers(ansObj => ({ ...ansObj, [idx + 1]: result }));
                      } catch {
                        setAnswers(ans => ({ ...ans, [idx + 1]: "Failed to fetch answer." }));
                      } finally {
                        setAnswerLoading(al => ({ ...al, [idx + 1]: false }));
                      }
                    }
                  }}
                  disabled={answerLoading[idx + 1]}
                  aria-expanded={!!expanded[idx + 1]}
                >
                  Q{idx + 1}: {question}
                </button>
                {answerLoading[idx + 1] && expanded[idx + 1] && <div className="text-blue-600 mt-2">Loading answer...</div>}
                {expanded[idx + 1] && answers[idx + 1] && (
                  <div className="mt-2 text-gray-700 border-t pt-2">
                    <span className="font-semibold">Answer</span>{" "}
                    {typeof answers[idx + 1] === 'string' ? (
                      <div className="prose bg-gray-100 p-2 rounded text-sm mt-1 max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{answers[idx + 1]}</ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(answers[idx + 1], null, 2)}</pre>
                    )}
                  </div>
                )}
              </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              No questions to display.<br />
              {rawResponse && (
                <>
                  <span className="text-xs">Raw API response:</span>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(rawResponse, null, 2)}</pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Right: Free Text QA Section removed */}
    </div>
  );
};

export default FAQDocument;
