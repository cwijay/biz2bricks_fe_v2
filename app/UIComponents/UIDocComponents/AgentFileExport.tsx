import React from "react";

interface AgentFileExportProps {
  agentOptions: string[];
  selectedAgent: string;
  onAgentChange: (value: string) => void;
  fileName: string;
  onExport: () => void;
}

const AgentFileExport: React.FC<AgentFileExportProps> = ({
  agentOptions,
  selectedAgent,
  onAgentChange,
  fileName,
  onExport,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-4 border rounded bg-white shadow">
      <div>
        <label className="block mb-1 font-semibold">Agents</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedAgent}
          onChange={e => onAgentChange(e.target.value)}
        >
          <option value="">Select Agent</option>
          {agentOptions.map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">File Name</label>
        <input
          className="w-full p-2 border rounded bg-gray-100"
          type="text"
          value={fileName}
          readOnly
        />
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        onClick={onExport}
        type="button"
      >
        Export Data
      </button>
    </div>
  );
};

export default AgentFileExport;
