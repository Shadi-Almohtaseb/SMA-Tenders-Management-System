const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(email: string, password: string, name: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getTenders() {
    return this.request("/tenders");
  }

  async getTender(id: number) {
    return this.request(`/tenders/${id}`);
  }

  async createTender(tender: any) {
    return this.request("/tenders", {
      method: "POST",
      body: JSON.stringify(tender),
    });
  }

  async updateTender(id: number, tender: any) {
    return this.request(`/tenders/${id}`, {
      method: "PUT",
      body: JSON.stringify(tender),
    });
  }

  async deleteTender(id: number) {
    return this.request(`/tenders/${id}`, {
      method: "DELETE",
    });
  }

  async getAuditLogs(tenderId: number) {
    return this.request(`/audit/tender/${tenderId}`);
  }

  async getAttachments(tenderId: number) {
    return this.request(`/attachments/tender/${tenderId}`);
  }

  async uploadAttachment(tenderId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenderId", tenderId.toString());

    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/attachments`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();
