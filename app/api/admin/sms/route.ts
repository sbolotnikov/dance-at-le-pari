import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export const runtime = 'nodejs'; // Twilio SDK needs Node.js (not Edge)

type RequestBody = { to: string; message: string };

export async function POST(req: NextRequest) {
  try {
    const { to, message } = (await req.json()) as RequestBody;
    if (!to || !/^\+1\d{10}$/.test(to)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid US phone number (E.164 +1XXXXXXXXXX).',
        },
        { status: 400 }
      );
    }
    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER; // Must be a Twilio-verified/purchased number

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { success: false, error: 'Server not configured for SMS.' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    const msg = await client.messages.create({
      to,
      from: fromNumber,
      body: message,
    });

    return NextResponse.json({ success: true, sid: msg.sid }, { status: 200 });
  } catch (err: any) {
    const errorMsg =
      err?.message ||
      'Failed to send SMS. Check server logs and Twilio configuration.';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
