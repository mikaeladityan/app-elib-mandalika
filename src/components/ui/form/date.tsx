"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { Calendar } from "../calendar";
import { cn, ParseDate } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { CalendarIcon } from "lucide-react";

type PropsDateForm = {
    name: string;
    control?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    label?: string;
    error?: { message?: string };
    className?: string;
};

export function DateForm({
    name,
    control,
    label,
    error,
    className,
    ...props
}: Omit<React.ComponentProps<typeof Calendar>, "selected" | "onSelect" | "mode"> & PropsDateForm) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className={cn("w-full space-y-1", className)}>
                    {label && (
                        <label htmlFor={name} className="font-semibold text-sm">
                            {label} {props.required && <span className="text-red-500">*</span>}
                        </label>
                    )}

                    <Popover>
                        <PopoverTrigger asChild className="rounded-md">
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal border-gray-600",
                                    !field.value && "text-muted-foreground",
                                    error && "border-red-500",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                    ParseDate(new Date(field.value)) // Date format: Month Day, Year
                                ) : (
                                    <span>Pilih tanggal</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                onSelect={(date) => {
                                    if (date instanceof Date) {
                                        field.onChange(date);
                                    } else {
                                        field.onChange(null);
                                    }
                                }}
                                selected={field.value ? new Date(field.value) : undefined}
                                captionLayout="dropdown"
                                {...props}
                            />
                        </PopoverContent>
                    </Popover>
                    {error?.message && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                </div>
            )}
        />
    );
}
