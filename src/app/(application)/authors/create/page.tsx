import { CreateAuthor } from "@/components/pages/author/form/create";
import { Suspense } from "react";

export default function CreateAuthorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateAuthor />
        </Suspense>
    );
}
