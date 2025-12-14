
import React, { useState } from "react";
import { getSearchResults, getFiles } from "@/app/UILibraries/actions";

type ExcelMapperProps = {
  selectedSourceFields: string[];
  onSourceFieldChange: (index: number, value: string) => void;
};

export default function ExcelMapper({ selectedSourceFields, onSourceFieldChange }: ExcelMapperProps) {
  const [sourceFile, setSourceFile] = useState("");
  const [fileOptions, setFileOptions] = useState<string[]>([]);
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    async function fetchFiles() {
      try {
        const result = await getFiles('uploaded_files');
        if (result && result.props && Array.isArray(result.props.fileData)) {
          setFileOptions(result.props.fileData.map((f: { name: string }) => f.name));
        }
      } catch {}
    }
    fetchFiles();
  }, []);

  const handleExtractMetadata = async () => {
    if (!sourceFile) {
      alert("Please enter a source file name.");
      return;
    }
    const prompt = `You are an expert in extracting key fields from document. Can you extract all 
                    important and relevant fields from the document. 
                    Eliminate the ones which does not rank high . 
                    Do not include any other text, value, explanation, or formatting.
                    Only display the field names in tabular format`;
    setLoading(true);
    try {
      const result = await getSearchResults(prompt, sourceFile);
      let answer = '';
      // Try to get best_result.answer if present
      if (result?.props?.data?.best_result?.answer) {
        answer = result.props.data.best_result.answer;
      } else if (typeof result?.props?.data === 'string') {
        answer = result.props.data;
      }
      // Parse answer for field names
      let fields: string[] = [];
      if (answer) {
        fields = answer
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.startsWith('|') && line.endsWith('|'))
          .map(line => line.replace(/\|/g, '').trim())
          .filter(line => line && !/^[-\s]+$/.test(line) && !/^field name$/i.test(line));
      }
      setSourceFields(fields);
    } catch (e) {
      alert("Failed to extract metadata.");
      setSourceFields([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md">
      <label className="block mb-2 font-semibold text-sm text-gray-700">
        Source File
      </label>
      <div className="mb-4">
        <select
          className="w-full border px-2 py-1 rounded text-sm mb-2"
          value={sourceFile}
          onChange={e => setSourceFile(e.target.value)}
        >
          <option value="">Select a file...</option>
          {fileOptions.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <input
          type="text"
          value={sourceFile}
          onChange={e => setSourceFile(e.target.value)}
          className="w-full border px-2 py-1 rounded text-sm"
          placeholder="Enter Excel file name..."
        />
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm mb-4"
        onClick={handleExtractMetadata}
        disabled={loading}
      >
        {loading ? 'Extracting...' : 'Extract Metadata'}
      </button>

      {sourceFields.length > 0 && (
        <div className="mt-4">
          <label className="block mb-2 font-semibold text-sm text-gray-700">Source Fields</label>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="mb-4 flex items-center gap-2">
              <span className="w-6 text-right text-sm text-gray-600">{i + 1}.</span>
              <select
                className="flex-1 border px-2 py-1 rounded text-sm"
                value={selectedSourceFields[i] || ""}
                onChange={e => onSourceFieldChange(i, e.target.value)}
              >
                <option value="">Select a field...</option>
                {sourceFields.map((field, idx) => (
                  <option key={idx} value={field}>{field}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
