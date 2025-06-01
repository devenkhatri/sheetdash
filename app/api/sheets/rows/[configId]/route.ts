import { NextResponse } from 'next/server';
import { sheets } from '../../auth/route';
import { configs } from '../../config/route';

export async function GET(
  request: Request,
  { params }: { params: { configId: string } }
) {
  if (!sheets) {
    return NextResponse.json(
      { error: 'Google Sheets client not initialized' },
      { status: 500 }
    );
  }

  try {
    const config = getConfig(params.configId);
    if (!config) {
      return NextResponse.json(
        { error: 'Sheet configuration not found' },
        { status: 404 }
      );
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: `${config.tabName}!A2:Z`,
    });

    const rows = response.data.values || [];
    const formattedRows = rows.map((row: any[], index: number) => {
      const data: Record<string, any> = {};
      config.columns.forEach((column, colIndex) => {
        data[column.id] = row[colIndex] || null;
      });

      return {
        id: (index + 2).toString(),
        rowNumber: index + 2,
        data,
      };
    });

    return NextResponse.json(formattedRows);
  } catch (error) {
    console.error('Failed to get rows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Google Sheet' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { configId: string } }
) {
  if (!sheets) {
    return NextResponse.json(
      { error: 'Google Sheets client not initialized' },
      { status: 500 }
    );
  }

  try {
    const config = getConfig(params.configId);
    if (!config) {
      return NextResponse.json(
        { error: 'Sheet configuration not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const values = config.columns.map(column => data[column.id] || '');

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheetId,
      range: `${config.tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values],
      },
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: `${config.tabName}!A1:A`,
    });

    const rowNumber = response.data.values?.length || 1;

    return NextResponse.json({
      id: rowNumber.toString(),
      rowNumber,
      data,
    });
  } catch (error) {
    console.error('Failed to add row:', error);
    return NextResponse.json(
      { error: 'Failed to add row to Google Sheet' },
      { status: 500 }
    );
  }
}

function getConfig(id: string) {
  return configs.get(id) || null;
}