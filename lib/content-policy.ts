export const roles = ['super_admin', 'administrator', 'programme_manager', 'research_editor', 'communications_editor', 'reviewer', 'author'];
export function canPublish(role: string) { return ['super_admin', 'administrator'].includes(role); }
export function canEdit(role: string, kind: string) { if (['super_admin', 'administrator', 'author', 'reviewer'].includes(role))
    return true; return role === 'programme_manager' ? ['programme', 'intervention', 'project', 'activity', 'impact'].includes(kind) : role === 'research_editor' ? ['research', 'publication', 'report', 'resource'].includes(kind) : role === 'communications_editor' ? ['news', 'insight', 'event', 'story', 'career'].includes(kind) : false; }
export function canSaveStatus(role: string, status: string) { if (canPublish(role))
    return true; return role === 'reviewer' ? ['review', 'approved'].includes(status) : ['draft', 'review'].includes(status); }
export function isPublicRecord(record: {
    status: string;
    meta: Record<string, any>;
}, now = Date.now()) { return record.status === 'published' && (!record.meta.publishAt || Date.parse(record.meta.publishAt) <= now); }
