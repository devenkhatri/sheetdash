import { GoogleSheetsAuth, SheetConfig, SheetRow } from './types';

// Client-side API wrapper
class GoogleSheetsClientAPI {
  private configs: Map<string, SheetConfig> = new Map();

  async setAuth(credentials: GoogleSheetsAuth): Promise<void> {
    const response = await fetch('/api/sheets/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credentials }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to authenticate with Google Sheets');
    }
  }

  async addConfig(config: Partial<SheetConfig>): Promise<SheetConfig> {
    const response = await fetch('/api/sheets/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add sheet configuration');
    }

    const newConfig = await response.json();
    this.configs.set(newConfig.id, newConfig);
    return newConfig;
  }

  async getConfigs(): Promise<SheetConfig[]> {
    const response = await fetch('/api/sheets/config');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch configurations');
    }
    const configs = await response.json();
    configs.forEach((config: SheetConfig) => this.configs.set(config.id, config));
    return configs;
  }

  async getConfig(id: string): Promise<SheetConfig | null> {
    const response = await fetch(`/api/sheets/config/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch configuration');
    }
    const config = await response.json();
    this.configs.set(config.id, config);
    return config;
  }

  async updateConfig(id: string, config: Partial<SheetConfig>): Promise<SheetConfig> {
    const response = await fetch(`/api/sheets/config/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update configuration');
    }

    const updatedConfig = await response.json();
    this.configs.set(updatedConfig.id, updatedConfig);
    return updatedConfig;
  }

  async deleteConfig(id: string): Promise<boolean> {
    const response = await fetch(`/api/sheets/config/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete configuration');
    }

    return this.configs.delete(id);
  }

  async getRows(configId: string): Promise<SheetRow[]> {
    const response = await fetch(`/api/sheets/rows/${configId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch rows');
    }
    return response.json();
  }

  async addRow(configId: string, data: Record<string, any>): Promise<SheetRow> {
    const response = await fetch(`/api/sheets/rows/${configId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add row');
    }

    return response.json();
  }

  async updateRow(configId: string, rowId: string, data: Record<string, any>): Promise<SheetRow> {
    const response = await fetch(`/api/sheets/rows/${configId}/${rowId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update row');
    }

    return response.json();
  }

  async deleteRow(configId: string, rowId: string): Promise<boolean> {
    const response = await fetch(`/api/sheets/rows/${configId}/${rowId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete row');
    }

    return true;
  }
}

export const sheetsClient = new GoogleSheetsClientAPI();