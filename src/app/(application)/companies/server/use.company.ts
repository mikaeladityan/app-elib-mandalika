import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CompanyService } from "./company.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { useRouter } from "next/navigation";
import { RequestCompanyDTO, ResponseCompanyDTO } from "./company.schema";
import { FetchError, ResponseError } from "@/lib/utils/error";

export function useCompany() {
    return useQuery({
        queryKey: ["company"],
        queryFn: CompanyService.get,
        staleTime: 10 * 60 * 1000,
    });
}

export function useUpsertCompany() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<ResponseCompanyDTO, ResponseError, RequestCompanyDTO>({
        mutationKey: ["company", "upsert"],
        mutationFn: (body) => CompanyService.upsert(body),
        onError: (err) => FetchError(err, setErr),
        onSuccess: (data) => {
            setNotif({
                title: "Pengaturan Perusahaan",
                message: `Anda berhasil melakukan perubahan data perusahaan ${data.name}`,
            });
            queryClient.invalidateQueries({ queryKey: ["company"], type: "all" });
            router.push("/companies");
        },
    });
}

export function useChangeLogo() {
    const setErr = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["company", "update", "logo"],
        mutationFn: ({ file }: { file: File }) => CompanyService.changeLogo(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company"] });
            setNotif({
                title: "Ganti Logo Perusahaan",
                message: "Berhasil melakukan pergantian logo perusahaan",
            });
        },
        onError: (err: ResponseError) => {
            FetchError(err, setErr);
        },
    });
}
