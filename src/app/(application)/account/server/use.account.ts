import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "./account.service";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";

export function useAccount() {
    const activeSession = useQuery({
        queryKey: ["account", "sessions"],
        queryFn: AccountService.getActiveSession,
    });

    return { activeSession };
}

export function useLogout() {
    const setError = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const logoutAll = useMutation({
        mutationKey: ["logout", "all-session"],
        mutationFn: AccountService.logoutAllSessions,
        onError: (err: ResponseError) => {
            FetchError(err, setError);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["account"] });
            queryClient.invalidateQueries({ queryKey: ["account", "sessions"] });
            setNotif({
                title: "Keluar Sesi Akun",
                message: "Berhasil mengeluarkan semua sesi akun",
            });
        },
    });

    return { logoutAll };
}
