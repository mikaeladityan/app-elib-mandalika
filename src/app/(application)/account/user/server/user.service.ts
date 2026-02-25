import { api, setupCSRFToken } from "@/lib/api";
import { RequestUserDTO } from "./user.schema";
const API = `${process.env.NEXT_PUBLIC_API}/api/app/accounts/users`;
export class UserService {
    static async upsert(data: RequestUserDTO) {
        try {
            await setupCSRFToken();
            await api.put(API, data);
        } catch (error) {
            throw error;
        }
    }

    static async changePhoto(file: File | null) {
        await setupCSRFToken();
        const formData = new FormData();
        formData.append("photo", file!, file!.name);
        // Upload via service
        await api.patch(API, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
    }
}
