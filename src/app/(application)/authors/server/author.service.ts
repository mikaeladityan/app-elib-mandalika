import { api, setupCSRFToken } from "@/lib/api";
import { QueryAuthorDTO, RequestAuthorDTO, ResponseAuthorDTO } from "./author.schema";
import { ApiSuccessResponse } from "@/shared/types";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/authors`;
function extractIds(items: Array<number | { id: number }>): number[] {
    return items.map((item) => (typeof item === "number" ? item : item.id));
}
export class AuthorService {
    static async create(body: RequestAuthorDTO) {
        try {
            await setupCSRFToken();
            await api.post(API, body);
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, body: Partial<RequestAuthorDTO>) {
        try {
            await setupCSRFToken();
            await api.put(`${API}/${id}`, body);
        } catch (error) {
            throw error;
        }
    }

    static async deleteMany(items: Array<number | { id: number }>) {
        const ids = extractIds(items);
        if (!ids.length) throw new Error("ID tidak boleh kosong");

        try {
            await setupCSRFToken();
            await api.delete(`${API}/delete`, {
                data: ids,
            });
        } catch (error) {
            throw error;
        }
    }

    static async restoreMany(items: Array<number | { id: number }>) {
        const ids = extractIds(items);
        if (!ids.length) throw new Error("ID tidak boleh kosong");

        try {
            await setupCSRFToken();
            await api.patch(`${API}/restore`, ids);
        } catch (error) {
            throw error;
        }
    }

    static async destroyMany(items: Array<number | { id: number }>) {
        const ids = extractIds(items);
        if (!ids.length) throw new Error("ID tidak boleh kosong");

        try {
            await setupCSRFToken();
            await api.delete(`${API}/destroy`, {
                data: ids,
            });
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryAuthorDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<ResponseAuthorDTO>; len: number }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: number) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseAuthorDTO>>(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
