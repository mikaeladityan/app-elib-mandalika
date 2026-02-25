"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { errorAtom } from "@/shared/store";

export function ErrorToastProvider() {
    const error = useAtomValue(errorAtom);

    useEffect(() => {
        if (!error.message && (!error.details || error.details.length === 0)) {
            return;
        }

        const content =
            error.details && error.details.length > 0 ? (
                <div className="space-y-1">
                    {error.details.map((err, idx) => (
                        <div key={idx} className="text-sm text-red-500">
                            <span className="font-medium text-red-500">[{err.path}]</span>{" "}
                            {err.message}
                        </div>
                    ))}
                </div>
            ) : (
                <span>{error.message}</span>
            );

        toast.error("Error", {
            duration: 6000,
            className: "bg-red-50 text-red-500 border border-red-200",
            description: <p className="text-red-500">{content}</p>,
        });
    }, [error]);

    return null;
}
