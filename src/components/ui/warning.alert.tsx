import { AlertCircle, RefreshCcw } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type propsWarningAlert = {
    title: string;
    children: React.ReactNode;
    refetch?: () => void;
    className?: string;
};
export function WarningAlert({ refetch, title, children, className }: propsWarningAlert) {
    return (
        <Alert
            className={cn("bg-amber-50 w-full max-w-xl text-amber-600 space-y-2 py-5", className)}
        >
            <AlertCircle size={50} className="text-lg w-6! h-6!" />
            <AlertTitle className="text-lg lg:text-base font-semibold ms-3">{title}</AlertTitle>
            <AlertDescription className="ms-3">
                {children}

                {refetch && (
                    <Button
                        type="button"
                        onClick={() => refetch()}
                        variant={"secondary"}
                        className="bg-amber-600 text-amber-50 hover:bg-amber-500 mt-3"
                    >
                        <RefreshCcw />
                        Muat Ulang
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
