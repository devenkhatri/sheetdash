import { SheetColumn, SheetRow } from './types';

/**
 * Parse a row from Google Sheets API format to our SheetRow format
 */
export function parseRow(rowData: any[], rowNumber: number, columns: SheetColumn[]): SheetRow {
  const data: Record<string, any> = {};
  
  columns.forEach((column, index) => {
    const value = rowData[index];
    
    // Convert the value based on the column type
    switch (column.type) {
      case 'number':
        data[column.id] = value !== '' ? Number(value) : null;
        break;
      case 'boolean':
        data[column.id] = value?.toLowerCase() === 'true' || value === true;
        break;
      case 'date':
        data[column.id] = value ? new Date(value) : null;
        break;
      case 'text':
      default:
        data[column.id] = value || '';
    }
  });

  return {
    id: rowNumber.toString(),
    rowNumber,
    data,
  };
}

/**
 * Create row data in the format expected by Google Sheets API
 */
export function createRowData(data: Record<string, any>, columns: SheetColumn[]): any[] {
  return columns.map(column => {
    const value = data[column.id];
    
    // Format the value based on the column type
    switch (column.type) {
      case 'boolean':
        return value ? 'TRUE' : 'FALSE';
      case 'date':
        return value ? (value instanceof Date ? value.toISOString() : value) : '';
      case 'number':
      case 'text':
      default:
        return value !== undefined && value !== null ? String(value) : '';
    }
  });
}

/**
 * Validate row data against column definitions
 */
export function validateRowData(data: Record<string, any>, columns: SheetColumn[]): Record<string, string> {
  const errors: Record<string, string> = {};
  
  columns.forEach(column => {
    const value = data[column.id];
    
    if (column.required && (value === undefined || value === null || value === '')) {
      errors[column.id] = `${column.header} is required`;
      return;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      switch (column.type) {
        case 'number':
          if (isNaN(Number(value))) {
            errors[column.id] = `${column.header} must be a number`;
          }
          break;
        case 'date':
          if (!(value instanceof Date) && isNaN(Date.parse(value))) {
            errors[column.id] = `${column.header} must be a valid date`;
          }
          break;
      }
    }
  });
  
  return errors;
}