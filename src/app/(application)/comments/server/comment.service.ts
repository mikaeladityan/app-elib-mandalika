import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/shared/types";
import { QueryCommentDTO, ResponseCommentDTO } from "@/app/(application)/posts/server/post.schema";

const API = `${process.env.NEXT_PUBLIC_API}/api/app/comments`;

export class CommentGlobalService {
    static async list(params: QueryCommentDTO) {
        const { data } = await api.get<
            ApiSuccessResponse<{ data: Array<ResponseCommentDTO>; len: number }>
        >(API, { params });
        return data.data;
    }
}
