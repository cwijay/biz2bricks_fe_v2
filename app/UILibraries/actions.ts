'use server';

import { error } from "console";
import { document } from "./definitions";
import { signIn } from "@/auth";
import { getPossibleInstrumentationHookFilenames } from "next/dist/build/utils";

//const BASE_API_URI = "http://127.0.0.1:8004"
const BASE_API_URI = "https://document-processing-service-38231329931.us-central1.run.app";
let Api_Url: string = "";

// Upload a file
// This function takes a FormData object containing the file to be uploaded
// The function is marked as 'async' to allow for asynchronous operations.
// It simulates a delay of 5 seconds before making the API call to upload the file
// The FormData object is expected to have a key 'file' containing the file to be uploaded.
// The function constructs the API URL using the BASE_API_URI and appends "/uploadfile/"
// It then creates a new FormData object, appends the file from the original FormData,
// and sends a POST request to the API URL with the FormData as the body.
export async function uploadFile(formData: FormData) {
    Api_Url = BASE_API_URI + "/uploadfile/";
    const fData = new FormData();
    fData.append('file', formData.get('file') as File);
    try {
        const response = await fetch(Api_Url, {
            method: 'POST',
            body: fData
        });
        if (!response.ok) {
            throw new Error("Upload failed: " + response.statusText);
        }
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error("Error uploading file", error);
        throw error;
    }
}
// Get the list of files in a directory
// This function takes a directory name as an argument and sends a GET request to retrieve the list
// The function is marked as 'async' to allow for asynchronous operations.
export async function getFiles(directory:string):Promise<any>{
    try {
        Api_Url = BASE_API_URI + "/listfiles/"+directory;
        const response = await fetch(Api_Url,{
            method:'get',
            headers: {
                'accept':'application/json'
            }
        });
        const data = await response.json();
        console.log(data.files);
        if( !data || !data.files || data.files.length === 0) {
            console.log("No files found in the directory.");
            return { props: { fileData: [] } };
        }
        // Map the file names to the expected format     
        let fileData = data.files.map((d: string) => {
            return {
                name: d
            }
        });
       //return Promise.resolve(fileData);
        return { props:{ fileData}};
    

    } catch (error) {
        console.log(error);
    }
}
// Parse a file
// This function takes a file name as an argument and sends a GET request to parse the file
// The function is marked as 'async' to allow for asynchronous operations.
export async function parseFile(fileName:string | null):Promise<any>{
    try {
        if (fileName === null) {
            throw new Error("File name is null");
        }
        Api_Url = BASE_API_URI + "/parsefile/"+fileName;
        const response = await fetch(Api_Url,{
            method:'get',
            headers: {
                'accept':'application/json'
            }
        });
        const data = await response.json();
        return { props:{ data}};
     }
    catch (error) {
        console.log(error);
    }
    
}
// Save the content of a file
// This function takes a file name and content, and sends a POST request to save the content
// The function is marked as 'async' to allow for asynchronous operations.
export async function saveContent(fileName:string | null, content:string | null):Promise<any>{
    try {
        if (fileName === null || content === null) {
            throw new Error("File name or content is null");
        }
        Api_Url = BASE_API_URI + "/saveandingst/"+fileName;
        const response = await fetch(Api_Url,{
            method:'post',
            headers: {
                'accept':'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content:content})
        });
        const data = await response.json();
        return { props:{ data}};
     }
    catch (error) {
        console.log(error);
    }
    
}
// Get summarized content of a file
// This function takes a file name and sends a GET request to retrieve the summarized content
// The function is marked as 'async' to allow for asynchronous operations.

export async function summarizeContent(fileName:string | null):Promise<any>{
    try {
        if (fileName === null) {
            throw new Error("File name is null");
        }
        Api_Url = BASE_API_URI + "/summarizecontent/"+fileName;
        const response = await fetch(Api_Url,{
            method:'get',
            headers: {
                'accept':'application/json'
            }
        });
        const data = await response.json();
        return { props:{ data}};
     }
    catch (error) {
        console.log(error);
    }
}
// Delete a file
// This function takes a directory and file name, and sends a DELETE request to remove the file

export async function deleteFile(directory:string, fileName:string):Promise<any>{
    try {
        Api_Url = BASE_API_URI + "/deletefile/" + directory + "/" + fileName;
        console.log('Calling API:{0}',Api_Url);
        const response = await fetch(Api_Url,{
            method:'delete',
            headers: {
                'accept':'application/json'
            }
        });
        const data = await response.json();
        return { props:{ data}};
     }
    catch (error) {
        console.log(error);
    }
}
// Generate document prompts
// This function takes a file name and an optional number of questions, and sends a GET request
// The function is marked as 'async' to allow for asynchronous operations.

export async function generateDocumentPrompts(fileName: string,NoOfQuestions?:number): Promise<any> {
    try {
        if (fileName === null) {
            throw new Error("File name is null");
        }
        Api_Url = BASE_API_URI + "/generatequestions/" + fileName;
        if( NoOfQuestions !== undefined && NoOfQuestions > 0) {
            Api_Url += `?noOfQuestions=${NoOfQuestions}`;
        }
        console.log('Calling API:{0}',Api_Url);
        const response = await fetch(Api_Url, {
            method: 'get',
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        return { props: { data } };
    } catch (error) {
        console.log(error);
    }
}
// Get search results
// This function takes a query string and sends a POST request to retrieve search results   
export async function getSearchResults(query: string, source_document?: string): Promise<any> {
    try {
        if (!query) {
            throw new Error("Query is empty");
        }
        // Always build payload with both fields
        const payload: { query: string, source_document?: string } = { query };
        if (source_document) {
            payload.source_document = source_document;
        }

        console.log('Payload to be sent:', JSON.stringify(payload));
        Api_Url = BASE_API_URI + "/hybridsearch/";
        console.log('Calling API:{0}', Api_Url);
        const response = await fetch(Api_Url, {
            method: 'post',
            headers: {
                'accept':'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Search Results:', data);
        return { props: { data } };
    } catch (error) {
        console.log(error);
    }
}
/// Handle user sign-in
// This function initiates the sign-in process using the signIn method from the auth module 
export async function handleSignIn(provider: string = "google") {
    // Implement sign-in logic here
    console.log("Sign-in logic to be implemented");
   //const res =  await signIn("google", { callbackUrl: "/UIPages/mydocuments" });
   switch(provider) {
    case "google":
        await signIn("google", { redirect: true, redirectTo: "/UIPages/mydocuments" });
        break;
    case "github":
        await signIn("github", { redirect: true, redirectTo: "/UIPages/mydocuments" });
        break;
    default:
        console.error("Unsupported provider:", provider);
        throw new Error("Unsupported provider");
   }
   //await signIn("google", { redirect: true, redirectTo: "/UIPages/mydocuments" });
   //await signIn(undefined,{ redirect: true, redirectTo: "/UIPages/mydocuments" });
   //console.log("Sign-in response:", res);
    //return res;
}


// Example usage:
// await getSearchResults("Who prepared the batch sheet?", "yourfile.pdf");