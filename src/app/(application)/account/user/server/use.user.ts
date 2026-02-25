import { FetchError, ResponseError } from "@/lib/utils/error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RequestUserDTO } from "./user.schema";
import { UserService } from "./user.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useRouter } from "next/navigation";

export function useFormUser() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const router = useRouter();
    const upsert = useMutation<unknown, ResponseError, RequestUserDTO>({
        mutationKey: ["user", "upsert"],
        mutationFn: (body) => UserService.upsert(body),
        onError: (err) => {
            FetchError(err, setErr);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["account"], type: "all" });
            setNotif({
                title: "Perubahan Profile",
                message: "Perubahan profile berhasil disimpan.",
            });
            router.push("/account");
        },
    });

    return {
        upsert: upsert.mutateAsync,
        isPending: upsert.isPending,
        error: upsert.error,
    };
}

export function useChangePhotoUser() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["account", "update", "photo"],
        mutationFn: ({ file }: { file: File }) => UserService.changePhoto(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["account"] });
            queryClient.invalidateQueries({ queryKey: ["account", "detail"] });
            setNotif({
                title: "Ganti Foto Akun",
                message: "Berhasil melakukan pergantian foto akun",
            });
        },
        onError: (err: ResponseError) => {
            FetchError(err, setErr);
        },
    });
}
