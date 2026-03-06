import { api } from "@/lib/api";
import { ResponseDashboardStatsDTO } from "./dashboard.schema";

export class DashboardService {
    static async getStats(): Promise<ResponseDashboardStatsDTO> {
        return await api.get("/application/dashboard/stats");
    }
}
