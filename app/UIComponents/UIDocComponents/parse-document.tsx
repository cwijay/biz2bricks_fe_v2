import { useState, useEffect } from "react";
import { parseFile } from "@/app/UILibraries/actions";
import { Textarea, Field, Label, Button, makeStyles,Caption1Strong } from "@fluentui/react-components";
import { Save20Regular, ArrowCircleLeft20Regular } from "@fluentui/react-icons";
import Link from "next/link";
import { get } from "http";
import { saveContent } from "@/app/UILibraries/actions";
import ProcessingDialog from "@/app/UIComponents/UIGenericComponents/processingDialog";
import { redirect } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

export default function ParseDocument() {

    const [parsedFileData, setParsedFileData] = useState('');
    //const [markdownContent, setMarkdownContent] = useState(parsedFileData? parsedFileData.text_content : "");
    const [fileToParse, setFileToParse] = useState('');
    const [showProgress, setShowProgress] = useState(true);
    const [processingMessage, setProcessingMessage] = useState("Processing your request...");

    const useStyles = makeStyles({
        wrapper: {
            columnGap: '15px',
            display: 'flex',
        }
    });
    const styles = useStyles();

    useEffect(() => {
        async function fetchParsedFileData() {
            const queryParams = new URLSearchParams(window.location.search);
            const fileName = queryParams.get("f");
            if (undefined !== fileName) {
                //setFileToParse(fileName);
                setProcessingMessage("Parsing file: " + fileName);
                setShowProgress(true);
                const parseFileResponse = parseFile(fileName);
                parseFileResponse.then((response) => {
                    console.log("Parse File Response: ", response);
                    // Handle the response as needed
                    setParsedFileData(response.props.data.text_content);
                    setFileToParse(response.props.data.metadata.file_name);
                    setShowProgress(false);
                }
                ).catch((error) => {
                    console.error("Error parsing file: ", error);
                }
                );
            }
            else {
                alert("File name not found in URL");
            }
        }
        fetchParsedFileData();
    }, []);
    // Function to handle the save button click
    // This function will save the parsed file data to the server
    // It checks if the parsed file data and file name are available before proceeding
    // If the save is successful, it will alert the user and can redirect to another page if needed
    // If the save fails, it will alert the user about the failure
    // The function is marked as 'async' to allow for asynchronous operations.
    const handleSaveClick = async () => {
        if (parsedFileData && fileToParse) {
            setProcessingMessage("Saving file content: " + fileToParse);
            setShowProgress(true);
            const saveResponse = await saveContent(fileToParse, parsedFileData);

            if (saveResponse) {
                setShowProgress(false);
                console.log("File content saved successfully:", saveResponse);
                alert(saveResponse.props.data.message || "File content saved successfully.");
                // Optionally, redirect or perform any other action after saving
                redirect('/UIPages/mydocuments');//window.location.href = '/dashboard/mydocuments';
            } else {
                alert("Failed to save file content.");
            }
        } else {
            alert("Parsed file data or file name is missing.");
        }
    };

    const getFileToParse = () => {

        const queryParams = new URLSearchParams(window.location.search);
        const fileName = queryParams.get("f");
        if (undefined !== fileName) {
            //setFileToParse(fileName);
            const parseFileResponse = parseFile(fileName);
            parseFileResponse.then((response) => {
                console.log("Parse File Response: ", response);
                // Handle the response as needed
                //setParsedFileData(response);
            }
            ).catch((error) => {
                console.error("Error parsing file: ", error);
            }
            );
        }
        else {
            alert("File name not found in URL");
        }


    };
    //getFileToParse();

    return (
        <>
        
            <ProcessingDialog message={processingMessage} showProgress={showProgress} />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">

                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        {parsedFileData && (
                            <div>
                                {/* <div className="mt-2">
                                <h3 className="text-lg font-semibold">Parsed File Data:{JSON.stringify(parsedFileData.metadata.file_name)}</h3>
                                <br />
                                <pre className="whitespace-pre-wrap">{JSON.stringify(parsedFileData.text_content, null, 2)}</pre>
                                <br />
                                
                            </div> */}
                                <div className="mt-12">
                                    <Field label={"Parsed File Data:" + fileToParse} className="mb-4">
                                        <Label>
                                                        <Caption1Strong>Document: </Caption1Strong>{fileToParse}
                                                    </Label>
                                        <Textarea size="large" value={parsedFileData} onChange={(e) => setParsedFileData(e.target.value)} resize="both" placeholder="" rows={20}>
                                        </Textarea>
                                        {/* <Textarea size="large"  onChange={(e) => setParsedFileData(e.target.value)} resize="both" placeholder="" rows={20}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsedFileData}</ReactMarkdown>
                                        </Textarea> */}
                                    </Field>

                                </div>
                                <div className={styles.wrapper}>
                                    <Button appearance="primary" icon={<Save20Regular />} onClick={handleSaveClick}>Save</Button>
                                    <Link href="/UIPages/mydocuments">
                                        <Button icon={<ArrowCircleLeft20Regular />}>Cancel</Button>
                                    </Link>

                                </div>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </>

    );
}