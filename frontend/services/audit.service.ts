import { api } from "@/services/api";

export interface AuditActor {
  id?: string;
  name?: string | null;
  email?: string | null;
}

export interface AuditTask {
  id?: string;
  title?: string | null;
}

export interface AuditLogItem {
  id: string;
  actionType: string;
  actor?: AuditActor | null;
  task?: AuditTask | null;
  taskTitle?: string | null;
  details?: Record<string, unknown> | null;
  createdAt?: string;
  timestamp?: string;
}

export interface AuditLogsResponse {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const auditService = {
  async getAuditLogs(
    page: number = 1,
    limit: number = 10,
  ): Promise<AuditLogsResponse> {
    const response = await api.get<AuditLogsResponse>("/audit", {
      params: { page, limit },
    });
    return response.data;
  },
};
