import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { RequestCompanyDTO, ResponseCompanyDTO } from "./company.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/companies`;
export class CompanyService {
    static async get() {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseCompanyDTO>>(API);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async upsert(body: RequestCompanyDTO) {
        try {
            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<ResponseCompanyDTO>>(API, body);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async changeLogo(file: File | null) {
        await setupCSRFToken();
        const formData = new FormData();
        formData.append("logo", file!, file!.name);
        // Upload via service
        await api.patch(API, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
    }
}
