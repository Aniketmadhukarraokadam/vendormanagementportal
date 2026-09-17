// Frontend typed API client for interacting with Next.js route handlers

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data;
}

// ─── AUTH ───
export async function apiLogin(email: string, password: string) {
  return apiFetch<{ success: boolean; user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ─── REQUIREMENTS ───
export async function apiGetRequirements(params?: { search?: string; status?: string; jobType?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.jobType) query.append('jobType', params.jobType);

  const qs = query.toString();
  return apiFetch<{ requirements: any[] }>(`/api/requirements${qs ? `?${qs}` : ''}`);
}

export async function apiCreateRequirement(data: any) {
  return apiFetch<{ success: boolean; requirement: any }>('/api/requirements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── SUBMISSIONS ───
export async function apiGetSubmissions(params?: { vendorId?: string; requirementId?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.vendorId) query.append('vendorId', params.vendorId);
  if (params?.requirementId) query.append('requirementId', params.requirementId);
  if (params?.status) query.append('status', params.status);

  const qs = query.toString();
  return apiFetch<{ submissions: any[] }>(`/api/submissions${qs ? `?${qs}` : ''}`);
}

export async function apiCreateSubmission(data: any) {
  return apiFetch<{ success: boolean; submission: any }>('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateSubmission(id: string, data: any) {
  return apiFetch<{ success: boolean; submission: any }>(`/api/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ─── VENDORS ───
export async function apiGetVendors() {
  return apiFetch<{ vendors: any[] }>('/api/vendors');
}

export async function apiCreateVendor(data: any) {
  return apiFetch<{ success: boolean; vendor: any }>('/api/vendors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── DOCUMENTS ───
export async function apiGetDocuments(vendorId?: string) {
  const qs = vendorId ? `?vendorId=${vendorId}` : '';
  return apiFetch<{ documents: any[] }>(`/api/documents${qs}`);
}

// ─── REPORTS ───
export async function apiGetReports() {
  return apiFetch<{
    metrics: {
      totalRequirements: number;
      openRequirements: number;
      totalSubmissions: number;
      activeVendors: number;
    };
    pipelineBreakdown: Record<string, number>;
    vendorLeaderboard: any[];
  }>('/api/reports');
}
