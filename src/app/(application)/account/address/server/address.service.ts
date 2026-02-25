import { api, setupCSRFToken } from "@/lib/api";
import { RequestAddressDTO, ResponseAddressDTO } from "./address.schema";
import { ApiSuccessResponse } from "@/shared/types";
const API = `${process.env.NEXT_PUBLIC_API}/api/app/accounts/addresses`;
export interface GetApiAddresses {
    id: number;
    text: string;
}
export class AddressService {
    static async create(body: RequestAddressDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestAddressDTO>) {
        try {
            await setupCSRFToken();
            await api.put(`${API}/${id}`, body);
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            await setupCSRFToken();
            await api.delete(`${API}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async changePrimary(id: number) {
        try {
            await setupCSRFToken();
            await api.patch(`${API}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async list() {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    addresses: Array<
                        Omit<
                            ResponseAddressDTO,
                            "account_id" | "created_at" | "updated_at" | "street" | "notes"
                        >
                    >;
                    len: number;
                }>
            >(API);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseAddressDTO>>(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    // API ADDRESS
    static async province() {
        const { data } = await api.get<ApiSuccessResponse<Array<GetApiAddresses>>>(
            `${API}/province`,
        );
        return data.data;
    }

    static async city(province_id: number) {
        const { data } = await api.get<ApiSuccessResponse<Array<GetApiAddresses>>>(
            `${API}/city?province_id=${province_id}`,
        );
        return data.data;
    }

    static async disctrict(city_id: number) {
        const { data } = await api.get<ApiSuccessResponse<Array<GetApiAddresses>>>(
            `${API}/district?city_id=${city_id}`,
        );
        return data.data;
    }

    static async subdistrict(district: number) {
        const { data } = await api.get<ApiSuccessResponse<Array<GetApiAddresses>>>(
            `${API}/subdistrict?district_id=${district}`,
        );
        return data.data;
    }
}
