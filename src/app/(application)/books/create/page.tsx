import { CreateBook } from "@/components/pages/book/form/create";
import { Suspense } from "react";

export default function CreteBookPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateBook />
        </Suspense>
    );
}
