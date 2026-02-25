import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { AccountSessions } from "./account.schema";
const API = `${process.env.NEXT_PUBLIC_API}/api/app/accounts`;
export class AccountService {
    static async getActiveSession() {
        try {
            const { data } = await api.get<ApiSuccessResponse<AccountSessions>>(
                `${API}/active-sessions`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async logoutAllSessions() {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/clear-sessions`);
        } catch (error) {
            throw error;
        }
    }
}
