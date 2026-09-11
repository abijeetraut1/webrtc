export interface CreateMeeting {
    userId: string;
    meetingCode: string;
    meetingName?: string;
    autoExpires?: boolean;
    expiresAt?: Date | null;
}

export interface Meeting extends CreateMeeting {
    id: string;
    meetingName: string;
    autoExpires: boolean;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}