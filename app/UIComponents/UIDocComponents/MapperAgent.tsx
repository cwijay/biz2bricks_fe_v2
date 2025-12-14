import React, { useState } from "react";

type MapperAgentProps = {
  onSaveMapping: (agentName: string) => void;
};

const MapperAgent: React.FC<MapperAgentProps> = ({ onSaveMapping }) => {
  const [agentName, setAgentName] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMapping(agentName);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 w-full max-w-sm">
      <label className="text-sm font-medium text-gray-700">
        Mapper Agent Name
        <input
          type="text"
          value={agentName}
          onChange={e => setAgentName(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          placeholder="Enter agent name"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Save Mapping
      </button>
    </form>
  );
};

export default MapperAgent;