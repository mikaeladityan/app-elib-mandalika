import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "./dashboard.service";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: () => DashboardService.getStats(),
    });
};
