
import { AuditLog } from './audit.service';

export function exportAuditJson(logs: AuditLog[], filename: string) {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function exportAuditCsv(logs: AuditLog[], filename: string) {
  const header = [
    'logId','entityType','entityId','action','changedBy','changedAt','source',
    'requestId','reason','prevHash','hash','oldValues','newValues'
  ];

  const rows = logs.map(l => [
    l.logId, l.entityType, l.entityId, l.action, l.changedBy, l.changedAt, l.source,
    safe(l.requestId), safe(l.reason), safe(l.prevHash), l.hash,
    JSON.stringify(l.oldValues ?? {}), JSON.stringify(l.newValues ?? {})
  ]);

  const csv = [header, ...rows]
    .map(cols => cols.map(escapeCsv).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string) {
  if (value == null) return '';
  const needQuotes = /[",\n]/.test(value);
  let v = value.replace(/"/g, '""');
  return needQuotes ? `"${v}"` : v;
}

function safe(v: unknown) { return v == null ? '' : String(v); }
