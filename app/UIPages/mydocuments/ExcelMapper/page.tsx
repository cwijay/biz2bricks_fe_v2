"use client";
import React from "react";
import ExcelMapper from "@/app/UIComponents/UIDocComponents/ExcelMapper";
import ExcelTargetMapper from "@/app/UIComponents/UIDocComponents/ExcelTargetMapper";
import MapperAgent from "@/app/UIComponents/UIDocComponents/MapperAgent";
import { firestoreInsert, firestoreSelect } from "@/app/UILibraries/AgentAPIs";

export default function ExcelMapperPage() {
  const [selectedSourceFields, setSelectedSourceFields] = React.useState<string[]>(Array(10).fill(""));
  const [selectedTargetFields, setSelectedTargetFields] = React.useState<string[]>(Array(10).fill(""));
  const [saving, setSaving] = React.useState(false);

  const handleSourceFieldChange = (index: number, value: string) => {
    setSelectedSourceFields(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleTargetFieldChange = (index: number, value: string) => {
    setSelectedTargetFields(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Remove handleMapFields, move logic to handleSaveMapping

  // Save Mapping handler for MapperAgent
  const handleSaveMapping = async (agentName: string) => {
    // Build mapping array
    const mapping = selectedSourceFields.map((source, i) => ({
      source,
      target: selectedTargetFields[i] || ""
    }));
    // Remove empty/none values
    const filtered = mapping.filter(pair => pair.source && pair.target && pair.source !== '(none)' && pair.target !== '(none)');
    // Check for one-to-one mapping (no duplicates in source or target)
    const sources = filtered.map(pair => pair.source);
    const targets = filtered.map(pair => pair.target);
    const hasDuplicate = (arr: string[]) => new Set(arr).size !== arr.length;
    if (hasDuplicate(sources) || hasDuplicate(targets)) {
      alert('Each source and target field must be mapped one-to-one (no duplicates).');
      return;
    }
    // Create array with all mappings (no 'documents' node)
    const json = filtered.map(pair => ({
      Agent_Id: agentName,
      Org_Id: "001",
      SourceField: pair.source,
      TargetField: pair.target
    }));
    setSaving(true);
    try {
      // Log the full JSON to the browser console
      console.log('Full Mapping JSON to be saved:', json);
   
      await firestoreInsert(json);
      alert('Mapping saved successfully!');
    } catch (e: any) {
      alert('Failed to save mapping: ' + (e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-white p-0 m-0">
      <div className="flex flex-row w-full items-start gap-12 m-0 p-0">
        <div className="flex flex-row w-auto gap-12 m-0 p-0">
          <div style={{ width: 400 }}>
            <ExcelMapper
              selectedSourceFields={selectedSourceFields}
              onSourceFieldChange={handleSourceFieldChange}
            />
          </div>
          <div style={{ width: 400 }}>
            <ExcelTargetMapper
              selectedTargetFields={selectedTargetFields}
              onTargetFieldChange={handleTargetFieldChange}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start w-full min-h-[300px] mt-12 px-8">
        <div className="flex flex-1 items-start justify-start w-full min-h-[300px] mt-12">
          <MapperAgent onSaveMapping={handleSaveMapping} />
        </div>
        {/* Removed jsonToInsert and firestoreData display */}
      </div>
    </main>
  );
}
