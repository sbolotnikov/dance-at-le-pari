import { NextApiRequest, NextApiResponse } from 'next';
// import { google } from 'googleapis';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Missing authorization code');
    }

    // const oauth2Client = new google.auth.OAuth2(
    //     process.env.GOOGLE_CLIENT_ID_DRIVE,
    //     process.env.GOOGLE_CLIENT_SECRET_DRIVE,
    //     'http://localhost:3000/api/oauth2callback'
    // );

    try {
        // const { tokens } = await oauth2Client.getToken(code as string);
        // const { refresh_token } = tokens;

        // console.log('Refresh Token:', refresh_token);
        // Store the refresh token securely in your application
        res.status(200).send('Authorization successful');

    } catch (error) {
        console.error('Token error:', error);
        res.status(500).send('Error retrieving tokens');
    }
};
