"use client";

import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type TimePickerFormProps = {
    name: string;
    control: any;
    label?: string;
    error?: { message?: string };
    required?: boolean;
    className?: string;
};

export function TimePickerForm({
    name,
    control,
    label,
    error,
    required,
    className,
}: TimePickerFormProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="space-y-1 w-full">
                    {label && (
                        <label className="text-sm font-semibold flex items-center">
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}

                    <div className="relative">
                        <input
                            type="time"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={cn(
                                "h-9 w-full rounded-md border border-gray-700 px-3 text-sm shadow-sm",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                error && "border-destructive",
                                className,
                            )}
                        />
                        {/* <Clock
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        /> */}
                    </div>

                    {error?.message && <p className="text-xs text-red-500">{error.message}</p>}
                </div>
            )}
        />
    );
}
