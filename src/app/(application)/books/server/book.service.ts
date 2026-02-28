import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryBookDTO, RequestBookDTO, ResponseBookDTO } from "./book.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/books`;

export class BookService {
    static async create(body: RequestBookDTO, cover: File | null) {
        try {
            const formData = new FormData();

            formData.append("data", JSON.stringify(body));

            if (cover instanceof File) {
                formData.append("cover", cover);
            }
            await setupCSRFToken();

            const { data } = await api.post<ApiSuccessResponse<{ id: string; title: string }>>(
                API,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: string, body: Partial<RequestBookDTO>, cover: File | null) {
        try {
            const formData = new FormData();
            // Masukkan data JSON-nya sebagai string
            formData.append("data", JSON.stringify(body));
            // Masukkan file-nya
            if (cover instanceof File) {
                formData.append("cover", cover);
            }
            await setupCSRFToken();
            const { data } = await api.put<ApiSuccessResponse<{ id: string; title: string }>>(
                `${API}/${id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async softDelete(id: string) {
        if (!id) throw new Error("ID tidak boleh kosong");
        try {
            await setupCSRFToken();
            await api.delete(`${API}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    static async restore(id: string) {
        if (!id) throw new Error("ID tidak boleh kosong");
        try {
            await setupCSRFToken();
            await api.patch(`${API}/${id}/restore`);
        } catch (error) {
            throw error;
        }
    }

    static async destroy(id: string) {
        if (!id) throw new Error("ID tidak boleh kosong");
        try {
            await setupCSRFToken();
            await api.delete(`${API}/${id}/destroy`);
        } catch (error) {
            throw error;
        }
    }

    static async addBookFile(id: string, file: File) {
        if (!id) throw new Error("ID Buku tidak boleh kosong");
        try {
            const formData = new FormData();
            formData.append("book_file", file);

            await setupCSRFToken();
            const { data } = await api.post<ApiSuccessResponse<any>>(
                `${API}/${id}/file`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteBookFile(id: string, fileId: string) {
        if (!id || !fileId) throw new Error("ID Buku atau File ID tidak valid");
        try {
            await setupCSRFToken();
            const { data } = await api.delete<ApiSuccessResponse<any>>(
                `${API}/${id}/file/${fileId}`,
            );
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async list(params: QueryBookDTO) {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{ data: Array<ResponseBookDTO>; len: number }>
            >(API, { params });
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async detail(id: string) {
        try {
            const { data } = await api.get<ApiSuccessResponse<ResponseBookDTO>>(`${API}/${id}`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static async getOptions() {
        try {
            const { data } = await api.get<
                ApiSuccessResponse<{
                    author: Array<{ id: number; first_name: string; last_name: string }>;
                    publisher: Array<{ id: number; slug: string; name: string }>;
                    category: Array<{ id: number; name: string; slug: string }>;
                }>
            >(`${API}/options`);
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
