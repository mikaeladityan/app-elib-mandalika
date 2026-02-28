"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

type PropsYearForm = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    className?: string;
    placeholder?: string;
};

export function YearForm({
    name,
    control,
    label,
    error,
    className,
    placeholder = "Pilih Tahun",
}: PropsYearForm) {
    // State untuk menentukan rentang tahun yang tampil di grid (viewing decade)
    const [viewDate, setViewDate] = React.useState(new Date());

    // Logika untuk generate 12 tahun dalam satu tampilan grid
    const currentYear = viewDate.getFullYear();
    const startYear = currentYear - (currentYear % 12);
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className={cn("w-full space-y-1", className)}>
                    {label && (
                        <label htmlFor={name} className="font-semibold text-sm">
                            {label}
                        </label>
                    )}

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal border-gray-600 rounded-sm",
                                    !field.value && "text-muted-foreground",
                                    error && "border-red-500",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? field.value : <span>{placeholder}</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                            {/* Header Navigasi Dekade */}
                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setViewDate(new Date(startYear - 12, 0))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-sm font-bold">
                                    {startYear} - {startYear + 11}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setViewDate(new Date(startYear + 12, 0))}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Grid Tahun */}
                            <div className="grid grid-cols-3 gap-2">
                                {years.map((year) => (
                                    <Button
                                        key={year}
                                        variant={field.value === year ? "default" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "h-9 w-full font-medium",
                                            field.value === year &&
                                                "bg-primary text-primary-foreground",
                                        )}
                                        onClick={() => {
                                            field.onChange(year);
                                        }}
                                    >
                                        {year}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {error?.message && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                </div>
            )}
        />
    );
}
