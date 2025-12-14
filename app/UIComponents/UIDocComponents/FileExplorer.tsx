"use client";
import React, { useState } from 'react';
import AgentFileExportModal from './AgentFileExportModal';
import { getFiles } from '../../UILibraries/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// Only two folders, no static files
const sampleData = [
	{ folder: 'uploaded_files', files: [] },
	{ folder: 'parsed_files', files: [] }
];


export default function FileExplorer({ data = sampleData }: { data?: { folder: string; files: { name: string; createdDate?: string; createdBy?: string }[] }[] }) {
	const router = useRouter();
	const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>(() => {
		const collapsed: { [key: string]: boolean } = {};
		data.forEach(({ folder }) => { collapsed[folder] = false; });
		return collapsed;
	});
	const [dynamicFiles, setDynamicFiles] = useState<{ [key: string]: { name: string; createdDate?: string; createdBy?: string }[] }>({});
	// Modal state
	const [exportModalOpen, setExportModalOpen] = useState(false);
	const [exportFileName, setExportFileName] = useState("");
	// Demo agent options/state
	const [selectedAgent, setSelectedAgent] = useState("");
	const agentOptions = ["Agent1", "Agent2", "Agent3"];

	const toggleFolder = (folder: string) => {
		setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
	};

	// Fetch files when a folder is opened and not yet loaded
	React.useEffect(() => {
		const fetchFiles = async (folder: string) => {
			try {
				const result = await getFiles(folder);
				if (result && result.props && Array.isArray(result.props.fileData)) {
					setDynamicFiles((prev) => ({ ...prev, [folder]: result.props.fileData }));
				}
			} catch {}
		};
		Object.keys(openFolders).forEach((folder) => {
			if (openFolders[folder] && !dynamicFiles[folder]) {
				fetchFiles(folder);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openFolders]);

		// Folders as divs, file list as table inside expanded folder
		return (
			<>
				<div className="w-full text-left m-0 p-0 flex-grow" style={{maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box', width: '100%'}}>
					{data.map(({ folder }) => {
						const folderDisplay = folder === 'uploaded_files' ? 'Uploaded Files' : folder === 'parsed_files' ? 'Parsed Files' : folder;
						const isOpen = openFolders[folder];
						return (
							<div key={folder} className="border-b border-gray-200 mb-3 pb-1">
								<div
									className={
										`flex items-center cursor-pointer px-2 py-1 hover:bg-blue-100 select-none` +
										(isOpen ? ' font-bold bg-gray-50' : ' bg-white')
									}
									style={{ minHeight: 28 }}
									onClick={() => toggleFolder(folder)}
								>
									<span style={{ width: 18, textAlign: 'center', marginRight: 4 }}>
										{isOpen ? <>&#9660;</> : <>&#9654;</>}
									</span>
									<span style={{ marginRight: 4 }}>{isOpen ? '📂' : '📁'}</span>
									<span>{folderDisplay}</span>
								</div>
								{isOpen && (
									<div className="pl-8 pb-2">
										<table className="w-full text-left border-collapse" style={{ borderSpacing: 0 }}>
											<thead>
												<tr className="border-b">
													<th className="py-1 px-2 w-1/3">File Name</th>
													<th className="py-1 px-2 w-1/5">Created Date</th>
													<th className="py-1 px-2 w-1/5">Created By</th>
													<th className="py-1 px-2 w-1/4">Actions</th>
												</tr>
											</thead>
											<tbody>
												{(() => {
													const displayFiles = dynamicFiles[folder] || [];
													if (displayFiles.length === 0) {
														return (
															<tr>
																<td colSpan={4} className="text-gray-400 text-center py-2 bg-gray-50" style={{ borderBottom: '1px solid #e5e7eb', padding: 0, margin: 0 }}>No files</td>
															</tr>
														);
													}
													return displayFiles.map((file) => (
														<tr key={file.name} className={"hover:bg-gray-50"} style={{ lineHeight: 1.4, borderBottom: '1px solid #e5e7eb', margin: 0 }}>
															<td style={{ padding: '6px 0', borderBottom: 'none', verticalAlign: 'middle' }}>
																<span style={{ display: 'inline-block', width: 18, marginRight: 4 }}>🗎</span>
																<Link href={`/${folder}/${file.name}`} className="text-blue-600 hover:underline" style={{ verticalAlign: 'middle' }}>
																	{file.name}
																</Link>
															</td>
															<td style={{ padding: '6px 0', borderBottom: 'none', verticalAlign: 'middle' }}>{'createdDate' in file ? String(file.createdDate) : ''}</td>
															<td style={{ padding: '6px 0', borderBottom: 'none', verticalAlign: 'middle' }}>{'createdBy' in file ? String(file.createdBy) : ''}</td>
															<td className="flex gap-2" style={{ padding: '6px 0', borderBottom: 'none', verticalAlign: 'middle' }}>
																<button
																	className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
																	onClick={(e) => {
																		e.stopPropagation();
																		const dotIdx = file.name.indexOf('.')
																		let newFileName = file.name;
																		if (dotIdx !== -1) {
																			newFileName = file.name.substring(0, dotIdx + 1) + 'md';
																		}
																		router.push(`/UIPages/mydocuments/summarize?f=${encodeURIComponent(newFileName)}`);
																	}}
																>
																	Summary
																</button>
																<button
																	className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
																	onClick={(e) => {
																		e.stopPropagation();
																		router.push(`/UIPages/mydocuments/faq?f=${encodeURIComponent(file.name)}`)
																	}}
																>
																	FAQ
																</button>
																<button
																	className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
																	onClick={(e) => {
																		e.stopPropagation();
																		setExportFileName(file.name);
																		setExportModalOpen(true);
																	}}
																>
																	Export Data
																</button>
															</td>
														</tr>
													));
												})()}
											</tbody>
										</table>
									</div>
								)}
							</div>
						);
					})}
				</div>
				{/* AgentFileExportModal for Export Data */}
				<AgentFileExportModal
					open={exportModalOpen}
					onClose={() => setExportModalOpen(false)}
					agentOptions={agentOptions}
					selectedAgent={selectedAgent}
					onAgentChange={setSelectedAgent}
					fileName={exportFileName}
					onExport={() => { alert(`Exporting data for ${exportFileName} and agent ${selectedAgent}`); setExportModalOpen(false); }}
				/>
			</>
		);
	}

