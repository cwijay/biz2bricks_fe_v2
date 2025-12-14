import React, { useState } from "react";
import * as XLSX from "xlsx";

// Extract column headers from the first sheet of the Excel file
async function extractExcelFields(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (Array.isArray(json) && json.length > 0) {
          // First row is assumed to be headers
          const headers = (json[0] as string[]).map(h => String(h));
          resolve(headers);
        } else {
          resolve([]);
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

type ExcelTargetMapperProps = {
  selectedTargetFields: string[];
  onTargetFieldChange: (index: number, value: string) => void;
};

export default function ExcelTargetMapper({ selectedTargetFields, onTargetFieldChange }: ExcelTargetMapperProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [excelFields, setExcelFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
      setExcelFields([]); // Reset fields on new file
    }
  };

  const handleExtractFields = async () => {
    if (!selectedFile) {
      alert("Please select an Excel template file.");
      return;
    }
    setLoading(true);
    try {
      const fields = await extractExcelFields(selectedFile);
      setExcelFields(fields);
    } catch (e) {
      alert("Failed to extract fields from Excel file.");
      setExcelFields([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md">
      <label className="block mb-2 font-semibold text-sm text-gray-700">
        Excel Template
      </label>
      <label className="block mb-1 font-semibold text-xs text-gray-500">File Template</label>
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          value={selectedFileName}
          readOnly
          className="flex-1 border px-2 py-1 rounded text-sm bg-gray-100"
          placeholder="No file selected"
        />
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          onClick={() => document.getElementById('excel-file-input')?.click()}
        >
          Browse
        </button>
      </div>
      <div className="mt-6"></div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm mb-4"
        onClick={handleExtractFields}
        disabled={loading}
      >
        {loading ? 'Extracting...' : 'Extract Fields'}
      </button>

      {excelFields.length > 0 && (
        <div className="mt-4">
          <label className="block mb-2 font-semibold text-sm text-gray-700">Excel Fields</label>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="mb-4 flex items-center gap-2">
              <span className="w-6 text-right text-sm text-gray-600">{i + 1}.</span>
              <select
                className="flex-1 border px-2 py-1 rounded text-sm"
                value={selectedTargetFields[i] || ""}
                onChange={e => onTargetFieldChange(i, e.target.value)}
              >
                <option value="">Select a field...</option>
                {excelFields.map((field, idx) => (
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
