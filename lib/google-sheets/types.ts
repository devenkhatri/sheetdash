export interface SheetConfig {
  id: string;
  name: string;
  sheetId: string;
  tabName: string;
  columns: SheetColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface SheetColumn {
  id: string;
  header: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required?: boolean;
}

export interface SheetRow {
  id: string;
  rowNumber: number;
  data: Record<string, any>;
}

export interface GoogleSheetsAuth {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}