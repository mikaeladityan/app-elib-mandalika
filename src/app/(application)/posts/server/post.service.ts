import { api, setupCSRFToken } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import {
    QueryPostDTO,
    RequestPostDTO,
    ResponsePostDTO,
    QueryCommentDTO,
    RequestCommentDTO,
    ResponseCommentDTO,
} from "./post.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/posts`;

export class PostService {
    static async create(body: RequestPostDTO) {
        await setupCSRFToken();
        const { data } = await api.post<ApiSuccessResponse<ResponsePostDTO>>(API, body);
        return data.data;
    }

    static async update(id: string, body: Partial<RequestPostDTO>) {
        await setupCSRFToken();
        const { data } = await api.put<ApiSuccessResponse<ResponsePostDTO>>(`${API}/${id}`, body);
        return data.data;
    }

    static async softDelete(id: string) {
        await setupCSRFToken();
        await api.delete(`${API}/${id}`);
    }

    static async restore(id: string) {
        await setupCSRFToken();
        await api.patch(`${API}/${id}/restore`);
    }

    static async destroy(id: string) {
        await setupCSRFToken();
        await api.delete(`${API}/${id}/destroy`);
    }

    static async list(params: QueryPostDTO) {
        const { data } = await api.get<
            ApiSuccessResponse<{ data: Array<ResponsePostDTO>; len: number }>
        >(API, { params });
        return data.data;
    }

    static async detail(id: string) {
        const { data } = await api.get<ApiSuccessResponse<ResponsePostDTO>>(`${API}/${id}`);
        return data.data;
    }

    // COMMENTS
    static async listComments(postId: string, params?: QueryCommentDTO) {
        const { data } = await api.get<
            ApiSuccessResponse<{ data: Array<ResponseCommentDTO>; len: number }>
        >(`${API}/${postId}/comments`, { params });
        return data.data;
    }

    static async createComment(postId: string, body: RequestCommentDTO) {
        await setupCSRFToken();
        const { data } = await api.post<ApiSuccessResponse<ResponseCommentDTO>>(
            `${API}/${postId}/comments`,
            body,
        );
        return data.data;
    }

    static async deleteComment(commentId: string) {
        await setupCSRFToken();
        // The backend route is defined as: PostRoutes.delete("/comments/:commentId", PostController.deleteComment);
        await api.delete(`${API}/comments/${commentId}`);
    }
}
