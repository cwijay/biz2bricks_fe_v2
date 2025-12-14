import React, { useEffect, useState } from "react";
import AgentFileExport from "./AgentFileExport";
import { firestoreList, populateExcel } from "../../UILibraries/AgentAPIs";

interface AgentFileExportModalProps {
  open: boolean;
  onClose: () => void;
  selectedAgent: string;
  onAgentChange: (value: string) => void;
  fileName: string;
  onExport: () => void;
}

const AgentFileExportModal: React.FC<AgentFileExportModalProps> = ({
  open,
  onClose,
  selectedAgent,
  onAgentChange,
  fileName,
  onExport,
}) => {
  const [agentOptions, setAgentOptions] = useState<string[]>([]);
  const [exportStatus, setExportStatus] = useState<string>("");
  const [exportResult, setExportResult] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setExportResult(null);
      setExportStatus("");
      firestoreList("001")
        .then((res) => {
          // Debug: log raw response
          console.log('Raw firestoreList response:', res);
          let agents: string[] = [];
          if (Array.isArray(res)) agents = res;
          else if (res && Array.isArray(res.agents)) agents = res.agents;
          else if (res && Array.isArray(res.agentnames)) agents = res.agentnames;
          else if (res && typeof res === 'object') agents = Object.values(res).flat().filter((v): v is string => typeof v === 'string');
          setAgentOptions(agents);
          console.log('Agents list from firestoreList:', agents);
        })
        .catch(() => setAgentOptions([]));
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold px-2"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {exportStatus && (
          <div className="mb-2 text-blue-700 font-semibold">{exportStatus}</div>
        )}
        {exportResult && (
          <div className="mb-2">
            {(() => {
              const url = exportResult.output_path || exportResult.fileUrl || exportResult.url || exportResult.downloadUrl;
              if (url) {
                // Extract file name from output_path for link text
                let fileNameFromUrl = fileName;
                if (exportResult.output_path) {
                  // Extract between last '/' and next '?' if present
                  const path = exportResult.output_path;
                  const start = path.lastIndexOf('/') + 1;
                  let end = path.indexOf('?', start);
                  if (end === -1) end = path.length;
                  fileNameFromUrl = path.substring(start, end) || fileName;
                } else if (url) {
                  // Fallback: extract between last '/' and next '?' if present
                  const start = url.lastIndexOf('/') + 1;
                  let end = url.indexOf('?', start);
                  if (end === -1) end = url.length;
                  fileNameFromUrl = url.substring(start, end) || fileName;
                }
                // Remove % signs from the filename
                fileNameFromUrl = fileNameFromUrl.replace(/%/g, "");
                // If first 3 letters are IMG, replace .md with .JPEG
                if (fileNameFromUrl.substring(0, 3) === "IMG") {
                  fileNameFromUrl = fileNameFromUrl.replace(/\.md$/i, ".JPEG");
                }
                return (
                  <>
                    <label className="block font-semibold mb-1">Download Exported File:</label>
                    <a
                      href={url}
                      download={fileNameFromUrl}
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fileNameFromUrl}
                    </a>
                  </>
                );
              } else {
                return (
                  <>
                    <label className="block font-semibold mb-1">Export API Response:</label>
                    <pre className="bg-gray-100 p-2 rounded text-xs max-h-48 overflow-auto border border-gray-200">
                      {JSON.stringify(exportResult, null, 2)}
                    </pre>
                  </>
                );
              }
            })()}
          </div>
        )}
        <AgentFileExport
          agentOptions={agentOptions}
          selectedAgent={selectedAgent}
          onAgentChange={onAgentChange}
          fileName={fileName}
          onExport={async () => {
            setExportStatus("Exporting to excel ..Pls wait.");
            setExportResult(null);
            let fileNameToExport = fileName;
            if (fileNameToExport.substring(0, 3) === "IMG" && fileNameToExport.toLowerCase().endsWith('.md')) {
              fileNameToExport = fileNameToExport.replace(/\.md$/i, '.JPEG');
            } else if (fileNameToExport.toLowerCase().endsWith('.md')) {
              fileNameToExport = fileNameToExport.replace(/\.md$/i, '.pdf');
            }
            try {
              const result = await populateExcel('001', selectedAgent, fileNameToExport);
              setExportStatus("Data uploaded successfully.");
              setExportResult(result);
            } catch (e: any) {
              setExportStatus('Failed to export data: ' + (e?.message || e));
              setExportResult(null);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AgentFileExportModal;
