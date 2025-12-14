import { Input } from "@fluentui/react-components";
import Link from "next/link";
import { Button } from '@/app/UIComponents/UIGenericComponents/button';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from "react";
import { uploadFile } from "@/app/UILibraries/actions";
import { useRouter } from "next/navigation";
import ProcessingDialog from "@/app/UIComponents/UIGenericComponents/processingDialog";


export default function UploadDocument() {
    
    const [showProgress, setShowProgress] = useState(false);
    const [processingMessage, setProcessingMessage] = useState("Processing your request...");

    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        } else {
            setFile(null);
        }
    }
    

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        setProcessingMessage("Uploading file...");
        setShowProgress(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const fileUploadResponse: any = await uploadFile(formData);
            setShowProgress(false);
            if (fileUploadResponse) {
                alert("File uploaded. Redirecting...");
                router.push('/UIPages/mydocuments/parsefile?f=' + file.name);
            } else {
                alert("File upload failed. Please try again.");
            }
        } catch (err) {
            setShowProgress(false);
            alert("File upload failed. Please try again.");
        }
    }

    return (

        
           <div>
            <ProcessingDialog message={processingMessage} showProgress={showProgress} />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                    Select File
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="file"
                            name="file"
                            type="file"
                            multiple
                            placeholder="Select a file"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            onChange={handleFileChange}
                            
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/UIPages/mydocuments"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                    <Button
                      type="button"
                      onClick={handleFileUpload}
                      style={{ backgroundColor: '#e63946', display: 'inline-block', zIndex: 10 }}
                      className="flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white"
                    >
                      Upload
                    </Button>
                </div>
            </div>
            </div>
        


    );
}