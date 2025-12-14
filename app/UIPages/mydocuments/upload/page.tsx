'use client'
import UploadDocument from "@/app/UIComponents/UIDocComponents/upload-document";
import { Title3 } from "@fluentui/react-components";

export default function Page() {
    return (
        <main>
            <Title3>Upload Document</Title3>
            <div>
                <UploadDocument />
            </div>
        </main>

    );
}