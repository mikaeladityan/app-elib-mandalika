export type AccountSessions = Array<{
    sessionId: string;
    lastActivity: number;
    createdAt: number;
    userAgent?: string;
    ipAddress?: string;
    location?: string;
    isCurrent?: boolean;
}>;
