"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../command";
import { Controller, Control } from "react-hook-form";

export type ComboboxOption = {
    value: string | number;
    label: string;
};

interface ComboboxFormProps {
    name: string;
    control: Control<any>;
    label: string;
    placeholder: string;
    options: ComboboxOption[];
    isLoading?: boolean;
    isError?: boolean;
    refetch?: () => void;
    sendLabel?: boolean;
    capitalize?: boolean;
    required?: boolean;
    className?: string;
}

export function ComboboxForm({
    name,
    control,
    label,
    placeholder,
    options = [],
    isLoading = false,
    isError = false,
    refetch,
    sendLabel = false,
    capitalize = false,
    required = false,
    className,
}: ComboboxFormProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter opsi berdasarkan search term secara lokal
    const filteredOptions = searchTerm
        ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                // Cari label yang terpilih berdasarkan value dari react-hook-form
                const selectedOption = options.find((opt) => {
                    if (typeof opt.value === "number") return opt.value === Number(field.value);
                    return opt.value === field.value;
                });

                const selectedLabel = selectedOption ? selectedOption.label : placeholder;

                return (
                    <div className={cn("w-full space-y-1", className)}>
                        {/* Label Konsisten */}
                        <label className="font-semibold text-sm">
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>

                        {isLoading ? (
                            <Skeleton className="h-10 w-full rounded-sm" />
                        ) : isError ? (
                            <div className="flex items-center gap-2 text-rose-500 text-xs font-medium">
                                Gagal memuat data {label.toLowerCase()}
                                <Button
                                    type="button"
                                    onClick={refetch}
                                    variant="link"
                                    className="h-auto p-0 text-xs text-rose-600 underline"
                                >
                                    Muat Ulang
                                </Button>
                            </div>
                        ) : (
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full justify-between border-gray-600 rounded-sm font-normal",
                                            !field.value && "text-muted-foreground",
                                            fieldState.error && "border-rose-500",
                                        )}
                                    >
                                        <span
                                            className={cn("truncate", capitalize && "capitalize")}
                                        >
                                            {selectedLabel}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="p-0 w-[--radix-popover-trigger-width]"
                                    align="start"
                                >
                                    <Command shouldFilter={false} className="w-full">
                                        <CommandInput
                                            placeholder={`Cari ${label.toLowerCase()}...`}
                                            value={searchTerm}
                                            onValueChange={setSearchTerm}
                                            className="h-9"
                                        />
                                        <CommandEmpty>Tidak ditemukan</CommandEmpty>
                                        <CommandGroup
                                            className={cn(
                                                "max-h-60 overflow-y-auto",
                                                capitalize && "capitalize",
                                            )}
                                        >
                                            {filteredOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.label} // Menggunakan label untuk pencarian internal command
                                                    onSelect={() => {
                                                        // Update value ke react-hook-form
                                                        field.onChange(
                                                            sendLabel ? option.label : option.value,
                                                        );
                                                        setOpen(false);
                                                        setSearchTerm(""); // Reset search setelah pilih
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === option.value
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    {option.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* Error Message Konsisten */}
                        {fieldState.error?.message && (
                            <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}
