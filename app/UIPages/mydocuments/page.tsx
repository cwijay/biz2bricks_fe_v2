'use client';
import { document } from "@/app/UILibraries/definitions";
import { lusitana } from "@/app/UIComponents/fonts";
import UploadedDocumentsTable from "@/app/UIComponents/UIDocComponents/table";
import { getFiles } from "@/app/UILibraries/actions";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { error } from "console";
import { json } from "stream/consumers";
import { Title3 } from "@fluentui/react-components";


export default function Page() {
    //const DIR: string = "uploaded_files"
    const DIR: string = "edited_files"

    let data: [] = [];

    const [myDocuments, SetFiles] = useState(data);

    useEffect(() => {
        async function getFilesData() {
            const docs = await getFiles(DIR);
            //console.log(JSON.stringify(docs.props.fileData));
            SetFiles(docs.props.fileData);
        }
        getFilesData();

    }, []);

    //const myDocuments = getFiles(DIR);

    //In actual, we will call API here
    const myDocuments1 = [
        {
            id: '1',
            name: 'test1.docx',
            path: '/docs/test1.docx',
            size: 140,
            uploadedBy: 'rahul'
        },
        {
            id: '2',
            name: 'test2.docx',
            path: '/docs/test2.docx',
            size: 140,
            uploadedBy: 'rahul'
        }
    ];

    return (
        <div className="w-full">
            <Title3>My Documents</Title3>

            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <UploadedDocumentsTable documents={myDocuments} />
                </Suspense>
            </div>
        </div>

    );


}