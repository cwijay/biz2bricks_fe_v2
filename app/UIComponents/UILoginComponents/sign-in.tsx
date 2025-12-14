

import { handleSignIn } from "@/app/UILibraries/actions";
//https://authjs.dev/getting-started/authentication/oauth

// export default function SignIn() {

//     return (
//         <form 
//         className="flex flex-col gap-4">
//             <button 
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                 onClick={async (e) => {
//                     e.preventDefault();
//                     await handleSignIn("google");
//                 }}
//             >
//                 Sign in with Google
//             </button>

//             <button
//                 type="submit"
//                 className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
//                 onClick={async (e) => {
//                     e.preventDefault();
//                     await handleSignIn("github");
//                 }}
//             >
//                 Sign in with GitHub
//             </button>
//         </form>
//     );
// }

export default function SignIn() {

      
    return (
        <form 
        className="flex flex-col gap-4">
            <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={async (e) => {
                    e.preventDefault();
                    await handleSignIn("google");
                }}
            >
                Sign in with Google
            </button>

            <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
                onClick={async (e) => {
                    e.preventDefault();
                    await handleSignIn("github");
                }}
            >
                Sign in with GitHub
            </button>
        </form>
    );
}