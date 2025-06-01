import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { GoogleSheetsAuth } from '@/lib/google-sheets/types';

let auth: any = null;
let sheets: any = null;

export async function POST(request: Request) {
  try {
    const { credentials }: { credentials: GoogleSheetsAuth } = await request.json();

    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    sheets = google.sheets({ version: 'v4', auth });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set auth:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Google Sheets' },
      { status: 500 }
    );
  }
}

export { auth, sheets };