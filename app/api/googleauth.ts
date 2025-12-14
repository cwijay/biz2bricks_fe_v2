import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_BIZ2BRICKS_GOOGLE_CLIENT_ID);   


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_BIZ2BRICKS_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }               

        // You can also create or update the user in your database here

        return res.status(200).json({ user: payload });
    } catch (error) {
        console.error('Error verifying Google ID token:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}