import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressService, GetApiAddresses } from "./address.service";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "@/shared/store";
import { FetchError, ResponseError } from "@/lib/utils/error";
import { RequestAddressDTO } from "./address.schema";
export function useAddress(id?: number) {
    const list = useQuery({
        queryKey: ["address"],
        queryFn: AddressService.list,
        enabled: !id,
    });

    const detail = useQuery({
        queryKey: ["address", id],
        queryFn: () => AddressService.detail(Number(id)),
        enabled: !!id,
    });

    return { list, detail };
}

export function useFormAddress(id?: number) {
    const setError = useSetAtom(errorAtom);
    const setNotif = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const create = useMutation<unknown, ResponseError, RequestAddressDTO>({
        mutationKey: ["address", "create"],
        mutationFn: (body) => AddressService.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["address"], type: "all" });
            setNotif({
                title: "Menambah Alamat Baru",
                message: "Berhasil menambahkan alamat baru",
            });
            window.location.replace("/account");
        },
        onError: (err) => FetchError(err, setError),
    });

    const update = useMutation<unknown, ResponseError, Partial<RequestAddressDTO>>({
        mutationKey: ["address", "update"],
        mutationFn: (body) => AddressService.update(Number(id), body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["address"], type: "all" });
            setNotif({
                title: "Melakukan Perubahan Alamat",
                message: "Berhasil melakukan perubahan alamat anda",
            });
            window.location.replace("/account");
        },
        onError: (err) => FetchError(err, setError),
    });

    const deleted = useMutation<unknown, ResponseError>({
        mutationKey: ["address", "delete"],
        mutationFn: () => AddressService.delete(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["address"], type: "all" });
            setNotif({
                title: "Hapus Alamat",
                message: "Anda berhasil menghapus alamat",
            });
        },
    });

    const changePrimary = useMutation<unknown, ResponseError>({
        mutationKey: ["address", "change-primary"],
        mutationFn: () => AddressService.changePrimary(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["address"], type: "all" });
            setNotif({
                title: "Ganti Alamat Utama",
                message: "Anda berhasil melakukan perubahan alamat utama",
            });
        },
    });

    return { create, update, deleted, changePrimary };
}

export function useApiAddress(province_id?: number, city_id?: number, district_id?: number) {
    // Search Region
    const provinceQuery = useQuery({
        queryKey: ["addresses", "province"],
        queryFn: AddressService.province,
    });

    const cityQuery = useQuery<unknown, ResponseError, GetApiAddresses[]>({
        queryKey: ["addresses", "city", province_id],
        queryFn: () => {
            // Pastikan province_id ada sebelum fetch
            if (province_id === undefined) {
                return Promise.reject(new Error("Invalid province ID"));
            }
            return AddressService.city(province_id);
        },
        enabled: !!province_id && !city_id, // Hanya fetch jika province_id tersedia
    });

    const disctrictQuery = useQuery<unknown, ResponseError, GetApiAddresses[]>({
        queryKey: ["addresses", "district", city_id],
        queryFn: () => {
            // Pastikan province_id ada sebelum fetch
            if (city_id === undefined) {
                return Promise.reject(new Error("Invalid province ID"));
            }
            return AddressService.disctrict(city_id!);
        },
        enabled: !!city_id, // Hanya fetch jika province_id tersedia
    });

    const subdistrictQuery = useQuery<unknown, ResponseError, GetApiAddresses[]>({
        queryKey: ["addresses", "subdistrict", district_id],
        queryFn: () => {
            // Pastikan province_id ada sebelum fetch
            if (district_id === undefined) {
                return Promise.reject(new Error("Invalid province ID"));
            }
            return AddressService.subdistrict(district_id!);
        },
        enabled: !!district_id, // Hanya fetch jika province_id tersedia
    });

    return {
        province: provinceQuery.data,
        city: cityQuery.data,
        district: disctrictQuery.data,
        subdistrict: subdistrictQuery.data,
        isLoading: provinceQuery.isLoading || cityQuery.isLoading || disctrictQuery.isLoading,
        isError: provinceQuery.isError || cityQuery.isError || disctrictQuery.isError,
    };
}
