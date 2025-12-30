
export interface AuditLog {
  logId?: string;
  actionPerformed: string;
  userId: string;
  entityType: string;
  entityId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  correlationId?: string;
}
