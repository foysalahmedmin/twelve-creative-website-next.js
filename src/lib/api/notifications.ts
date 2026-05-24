import { apiFetch } from "@/lib/admin/api-client";

export const NOTIFICATIONS_TAG = "notifications";

export interface ApiNotificationData {
  _id: string;
  title: string;
  message: string;
  type: "contact" | "booking";
  created_at: string;
}

export interface ApiNotificationRecipient {
  _id: string;
  notification: ApiNotificationData;
  is_read: boolean;
  read_at: string | null;
  metadata?: { url?: string };
  created_at: string;
}

interface RawNotificationsMeta {
  total?: number;
  page?: number;
  limit?: number;
  statistics?: { unread?: number };
}

export interface NotificationsMeta {
  total: number;
  page: number;
  limit: number;
  unread: number;
}

export async function getAdminNotifications(limit = 20): Promise<{
  data: ApiNotificationRecipient[];
  meta: NotificationsMeta;
}> {
  try {
    const res = await apiFetch<ApiNotificationRecipient[]>(
      `/api/notification-recipient/self?sort=-created_at&limit=${limit}`,
      { tags: [NOTIFICATIONS_TAG] },
    );
    const raw = res.meta as RawNotificationsMeta | undefined;
    return {
      data: (res.data as ApiNotificationRecipient[]) ?? [],
      meta: {
        total: raw?.total ?? 0,
        page: raw?.page ?? 1,
        limit: raw?.limit ?? limit,
        unread: raw?.statistics?.unread ?? 0,
      },
    };
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit, unread: 0 } };
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const { meta } = await getAdminNotifications(1);
    return meta.unread;
  } catch {
    return 0;
  }
}
