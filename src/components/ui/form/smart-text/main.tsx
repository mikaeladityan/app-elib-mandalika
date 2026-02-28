"use client";

import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useSmartTextarea } from "./hook";

type Props = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    className?: string;
    maxLength?: number;
};

export function SmartTextareaForm({
    name,
    control,
    label,
    error,
    className,
    maxLength = 1000,
    ...props
}: React.ComponentProps<"textarea"> & Props) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const { handleKeyDown } = useSmartTextarea((val) => field.onChange(val));

                return (
                    <div className="space-y-1">
                        {label && <label className="font-semibold text-sm">{label}</label>}

                        <div className="relative">
                            <Textarea
                                {...field}
                                {...props}
                                id={name}
                                maxLength={maxLength}
                                onKeyDown={handleKeyDown}
                                className={cn(
                                    "min-h-28 border-gray-600 text-sm pr-12 rounded-sm",
                                    className,
                                    error && "border-red-500",
                                )}
                            />

                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                {field.value?.length || 0}/{maxLength}
                            </div>
                        </div>

                        {error?.message && <p className="text-red-500 text-xs">{error.message}</p>}
                    </div>
                );
            }}
        />
    );
}
