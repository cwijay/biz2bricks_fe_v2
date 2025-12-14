import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import "./summarize-document.css";
import "./summarize-document.css";
// ...existing code...
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { summarizeContent } from "@/app/UILibraries/actions";
import { Textarea, Field, Button, makeStyles, Caption1Strong, Label } from "@fluentui/react-components";
import { Save20Regular, ArrowCircleLeft20Regular } from "@fluentui/react-icons";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import ProcessingDialog from "@/app/UIComponents/UIGenericComponents/processingDialog";
import remarkGfm from 'remark-gfm';


export default function SummarizeDocument() {

    const [summary, setSummary] = useState('');
    const summaryRef = useRef<HTMLDivElement>(null);
    // Export summary to Excel
    const handleExportExcel = () => {
        if (!summary) return;
        // Split summary into header, table, and footer
        const lines = summary.split("\n");
        let tableStart = -1, tableEnd = -1;
        // Find first and last line of the markdown table
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith("|")) {
                if (tableStart === -1) tableStart = i;
                tableEnd = i;
            }
        }
        let aoa: string[][] = [];
        // Add header (before table)
        if (tableStart > 0) {
            for (let i = 0; i < tableStart; i++) {
                if (lines[i].trim() !== "") aoa.push([lines[i]]);
            }
        }
        // Add table rows
        if (tableStart !== -1 && tableEnd !== -1) {
            const tableLines = lines.slice(tableStart, tableEnd + 1);
            const tableRows = tableLines.map((l: string) => l.split("|").slice(1, -1).map((cell: string) => cell.trim()));
            aoa = aoa.concat(tableRows);
        }
        // Add footer (after table)
        if (tableEnd !== -1 && tableEnd < lines.length - 1) {
            for (let i = tableEnd + 1; i < lines.length; i++) {
                if (lines[i].trim() !== "") aoa.push([lines[i]]);
            }
        }
        // If no table, just export the summary as a single cell
        if (aoa.length === 0) aoa = [[summary]];
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Summary");
        XLSX.writeFile(wb, `summary_${fileToSummarize || 'document'}.xlsx`);
    };

    // Export summary to PDF
    const handleExportPDF = async () => {
        if (!summaryRef.current) return;
        const element = summaryRef.current;
        // Use html2canvas to render the summary div
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        // Calculate width/height to fit A4
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 40;
        const imgHeight = canvas.height * (imgWidth / canvas.width);
        pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        pdf.save(`summary_${fileToSummarize || 'document'}.pdf`);
    };
    const [fileToSummarize, setFileToSummarize] = useState('');
    const [showProgress, setShowProgress] = useState(true);
    const [processingMessage, setProcessingMessage] = useState("Getting document summary...");

    const useStyles = makeStyles({
        buttonwrapper: {
            columnGap: '15px',
            display: 'flex',
        },
        fieldwrapper: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '100%',
         
        },
       
    });
    const styles = useStyles();

    useEffect(() => {
        async function fetchDocumentSummary() {
            const queryParams = new URLSearchParams(window.location.search);
            const fileName = queryParams.get("f");
            if (fileName) {
                setProcessingMessage("Getting document summary for: " + fileName);
                setShowProgress(true);
                const summaryResponse = await summarizeContent(fileName);
                if(summaryResponse.error) {
                    console.error("Error summarizing document:", summaryResponse.error);
                    alert("Error summarizing document: " + summaryResponse.error);
                    setShowProgress(false);
                    return;
                }
                setSummary(summaryResponse.props.data.summary);
                setFileToSummarize(fileName);
                setShowProgress(false);
            } else {
                alert("File name not found in URL");
            }
        }
        fetchDocumentSummary();
    }, []);

    const handleSaveClick = async () => {
        if (summary && fileToSummarize) {
            // Implement save functionality here
            alert("Summary saved successfully.");
        } else {
            alert("No summary to save.");
        }
    };

    return (
        <div className={styles.fieldwrapper}>
            {/* ...existing code... */}
            <ProcessingDialog message={processingMessage} showProgress={showProgress} />
            <Label></Label>
            <Label>
                <Caption1Strong>Document: </Caption1Strong>{fileToSummarize}
            </Label>
            <div ref={summaryRef} style={{ background: 'white', borderRadius: 8, marginBottom: 12, width: '100%' }}>
                <div className="markdown-summary formatted-markdown" style={{ width: '100%' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({node, ...props}) => (
                        <table className="custom-markdown-table" {...props} />
                      ),
                      th: ({node, ...props}) => (
                        <th className="custom-markdown-th" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="custom-markdown-td" {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className="custom-markdown-p" {...props} />
                      ),
                    }}
                  >{summary}</ReactMarkdown>
                </div>
            </div>
            <div className={styles.buttonwrapper}>
                <Button appearance="primary" onClick={handleExportPDF} style={{ background: '#e63946', color: 'white' }}>
                    Export to PDF
                </Button>
                <Button appearance="primary" onClick={handleExportExcel} style={{ background: '#e63946', color: 'white' }}>
                    Export to Excel
                </Button>
                <Button appearance="primary" style={{ background: '#e63946', color: 'white' }}
                    onClick={() => {
                        if (fileToSummarize) {
                            window.location.href = `/UIPages/mydocuments/parsefile?f=${encodeURIComponent(fileToSummarize)}`;
                        } else {
                            alert('No file to edit.');
                        }
                    }}>
                    Edit
                </Button>
                <Link href="/UIPages/mydocuments">
                    <Button icon={<ArrowCircleLeft20Regular />} style={{ background: '#e63946', color: 'white' }}>Cancel</Button>
                </Link>
                {/* <Button appearance="primary" icon={<Save20Regular />} onClick={handleSaveClick}>Save Summary</Button> */}
            </div>
        </div>
    );
}
//                 Upload Document