'use client';
import { useEffect } from "react";

import  handler from "@/app/api/googleauth";
import { useRouter } from 'next/navigation';

export default function GoogleLogin() {
    const router = useRouter();
    console.log("GoogleLogin component rendered");
    useEffect(() => {
        //Global Google object
        const initializeGoogleSignIn = () => {
            if (typeof window !== 'undefined' && window.google) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_BIZ2BRICKS_GOOGLE_CLIENT_ID || '',
                    callback: handleCredentialResponse,
                    auto_select: true,
                    
                });

                window.google.accounts.id.renderButton(
                    document.getElementById('googleSignInDiv')!,
                    { theme: 'outline', size: 'large' } // customization attributes
                );
            }
        };

        const handleCredentialResponse = (response: any) => {
            console.log('Encoded JWT ID token: ' + response.credential);
            // Handle the response, e.g., send it to your server for verification
            fetch('/api/googleauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.credential }),
            })
            .then(res => res.json())
            .then(data => {
                console.log('User info from server:', data);
                // You can store user info in state or context here
                
                router.push('/UIPages/mydocuments');
            })
            .catch(error => {
                console.error('Error verifying token:', error);
            });
        };

        // Load the Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        };
        initializeGoogleSignIn();  
    }, []);

    return (
        <div>
            <div id="googleSignInDiv"></div>
        </div>
    );
}
