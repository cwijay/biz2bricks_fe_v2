import { document } from "@/app/UILibraries/definitions";
import { lusitana } from "../fonts";
import { Button, TableCellLayout,makeStyles, Label } from "@fluentui/react-components";
import { deleteFile, getFiles } from "@/app/UILibraries/actions";

import { useState,useEffect } from 'react';
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DocumentRegular,
  AddCircle24Regular,
  Icons20Regular,
  Delete20Regular,
  Search20Regular
} from "@fluentui/react-icons";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Table
} from "@fluentui/react-components";
import {DialogMessage} from "../UIGenericComponents/dialog";
import  ProcessingDialog  from "@/app/UIComponents/UIGenericComponents/processingDialog";


export default function UploadedDocumentsTable({
  documents,
}: {
  documents: document[];
}) {
    //const allDocuments = use(documents);
    const columns = [
        { columnkey: 'file', label: 'Document Name' },
        { columnkey: 'summarize', label: 'Summarize Document' },
        { columnkey: 'actions', label: 'Actions' }
    ];
    const DIR_NAME: string = "parsed_files";

    const [allDocuments, setAllDocuments] = useState(documents);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [showProgress, setShowProgress] = useState(false);
    const [processingMessage, setProcessingMessage] = useState("Processing your request...");
    /// Fetch the list of files when the component mounts
    useEffect(() => {
        async function fetchFiles() {
            //const DIR_NAME: string = "edited_files";
            const DIR_NAME: string = "parsed_files";
           
            setProcessingMessage("Fetching files...");
             setShowProgress(true);
            const getFilesResponse = await getFiles(DIR_NAME);
            if (getFilesResponse) { 
                setShowProgress(false);
                
                setAllDocuments(getFilesResponse.props.fileData);
            } else {
                alert("Failed to fetch files.");
                
            }
        }
        fetchFiles();
    }, []);

    function parseFileClick(fileName:string) {
        redirect('/UIPages/mydocuments/parsefile?f='+fileName);
    }
    /// Handle the click event for the delete button
    // This function will be called when the delete button is clicked
    async function handleDeleteFileClick(fileName: string) {
        //const DIR_NAME: string = "edited_files"
        if (!fileName) {
            //alert("File name is not provided.");
            setDialogMessage("File name is not provided.");
            setShowDialog(true);
            return;
        }
        setProcessingMessage("Deleting file...");
        setShowProgress(true);
        const deleteResponse = await deleteFile(DIR_NAME, fileName);
        if (deleteResponse) {
            setShowProgress(false);
            console.log("File deleted successfully:", deleteResponse);
            //alert(deleteResponse.props.data.message || "File deleted successfully.");
            setDialogMessage(deleteResponse.props.data.message || "File deleted successfully.");
            setShowDialog(true);
            // Optionally, redirect or perform any other action after deleting
            const getFilesResponse = await getFiles(DIR_NAME);
            if (getFilesResponse) { 
                setAllDocuments(getFilesResponse.props.fileData);
            } 
        } else {
            alert("Failed to delete the file.");
        }
    }

   
    // Define the CSS styles for the link

    const linkCss : React.CSSProperties = {
        color: 'blue',
        padding: '20px',
        textDecoration: 'underline',
    };
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

  return (
    <>
    
    <ProcessingDialog message={processingMessage} showProgress={showProgress} />
      <div className={styles.fieldwrapper}>
      
      <Label></Label>
      <Link href='/UIPages/mydocuments/upload'><Button icon={<AddCircle24Regular />}>Upload New Document</Button></Link>
      <Label></Label>
      <Table aria-label="My Documents" style={{ width: '100%' }}>
        <TableHeader>
          <TableRow>
            { columns.map((column) => (
              <TableHeaderCell key={column.columnkey} scope="col">
                {column.label}
              </TableHeaderCell>
            ))}
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {allDocuments?.map((document) => (
            <TableRow key={document.name}>
              <TableCell  onClick={() => parseFileClick(document.name)}>
                <TableCellLayout media={<DocumentRegular />} >
                <a style={linkCss}>{document.name}</a>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>
                  <Link href={`/UIPages/mydocuments/summarize?f=${document.name}`}>
                    <Button appearance="primary">Summarize</Button>
                  </Link>
                </TableCellLayout>
                </TableCell> 
              <TableCell >
                <TableCellLayout className={styles.buttonwrapper}>
                  
                    <Button icon={<Delete20Regular />} onClick={() =>handleDeleteFileClick(document.name)}></Button>
                    <Link href={`/UIPages/search?f=${document.name}`}>
                      <Button icon={<Search20Regular />}></Button>  
                    </Link>
                </TableCellLayout>  
              </TableCell>
            </TableRow>
          ))}
        </TableBody>    
        </Table>  
    </div>
    
    </>
    
  );
}
