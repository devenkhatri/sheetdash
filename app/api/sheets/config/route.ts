import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { auth, sheets } from '../auth/route';
import { SheetConfig } from '@/lib/google-sheets/types';

// Export configs Map to share across routes
export const configs = new Map<string, SheetConfig>();

export async function GET() {
  try {
    return NextResponse.json(Array.from(configs.values()));
  } catch (error) {
    console.error('Failed to get configs:', error);
    return NextResponse.json(
      { error: 'Failed to get configurations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!sheets) {
    return NextResponse.json(
      { error: 'Google Sheets client not initialized' },
      { status: 500 }
    );
  }

  try {
    const config: Partial<SheetConfig> = await request.json();

    // Validate required fields
    if (!config.name || !config.sheetId || !config.tabName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify sheet access
    try {
      const response = await sheets.spreadsheets.get({
        spreadsheetId: config.sheetId,
      });

      if (!response.data.sheets?.some(sheet => 
        sheet.properties?.title === config.tabName
      )) {
        return NextResponse.json(
          { error: 'Tab not found in spreadsheet' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error('Sheet access error:', error);
      return NextResponse.json(
        { error: 'Unable to access spreadsheet. Please check the Sheet ID and permissions.' },
        { status: 403 }
      );
    }

    // Get headers from the first row
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: `${config.tabName}!1:1`,
    });

    const headers = headerResponse.data.values?.[0] || [];
    const columns = headers.map(header => ({
      id: header.toLowerCase().replace(/\s+/g, '_'),
      header,
      type: 'text',
      required: false,
    }));

    const now = new Date().toISOString();
    const newConfig: SheetConfig = {
      ...config as SheetConfig,
      id: Math.random().toString(36).substring(2, 15),
      columns,
      createdAt: now,
      updatedAt: now,
    };

    configs.set(newConfig.id, newConfig);
    return NextResponse.json(newConfig);
  } catch (error) {
    console.error('Failed to add config:', error);
    return NextResponse.json(
      { error: 'Failed to access Google Sheet' },
      { status: 500 }
    );
  }
}