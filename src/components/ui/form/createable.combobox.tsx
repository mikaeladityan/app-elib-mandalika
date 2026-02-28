"use client";

import React, { useState } from "react";
import { useController, FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type EnhancedCreatableComboboxProps = {
    name: string;
    label?: string;
    control: any;
    placeholder?: string;
    options: { value: string | number; label: string; id?: number }[];
    isLoading?: boolean;
    isError?: boolean;
    refetch?: () => void;
    className?: string;
    required?: boolean;
    multiple?: boolean; // Prop baru untuk menentukan mode
};

export function EnhancedCreatableCombobox({
    name,
    label,
    control,
    placeholder = "Pilih data",
    options = [],
    isLoading = false,
    isError = false,
    refetch,
    className,
    required = false,
    multiple = false, // Default ke single select
}: EnhancedCreatableComboboxProps) {
    const { field, fieldState } = useController({ name, control });
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    // Helper untuk menangani data agar tidak error saat map/filter
    const getValues = (): string[] => {
        if (!field.value) return [];
        return Array.isArray(field.value) ? field.value : [field.value];
    };

    const selectedValues = getValues();

    const handleSelect = (val: string) => {
        if (multiple) {
            const newValue = selectedValues.includes(val)
                ? selectedValues.filter((v) => v !== val)
                : [...selectedValues, val];
            field.onChange(newValue);
        } else {
            field.onChange(val);
            setOpen(false);
        }
        setSearchValue("");
    };

    const handleCreate = () => {
        const trimmed = searchValue.trim();
        if (!trimmed) return;

        if (multiple) {
            if (!selectedValues.includes(trimmed)) {
                field.onChange([...selectedValues, trimmed]);
            }
        } else {
            field.onChange(trimmed);
            setOpen(false);
        }
        setSearchValue("");
    };

    const handleRemoveTag = (e: React.MouseEvent, val: string) => {
        e.preventDefault();
        e.stopPropagation();

        const currentValues = Array.isArray(field.value) ? field.value : [];
        const newValue = currentValues.filter((v: any) => String(v) !== String(val));

        field.onChange(newValue);
    };

    // Teks yang muncul di tombol trigger
    const renderTriggerContent = () => {
        if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;

        if (selectedValues.length === 0)
            return <span className="text-muted-foreground">{placeholder}</span>;

        if (multiple) {
            return (
                <div className="flex flex-wrap gap-1 py-1">
                    {selectedValues.map((val) => {
                        const labelObj = options.find((o) => String(o.value) === String(val));
                        const labelText = labelObj ? labelObj.label : val;

                        return (
                            <Badge
                                key={val}
                                variant="secondary"
                                className="rounded-sm font-medium capitalize flex items-center gap-1 pr-1"
                            >
                                {labelText}
                                <div
                                    role="button"
                                    className="ml-1 rounded-full outline-none hover:bg-rose-100 hover:text-rose-600 p-0.5 transition-colors"
                                    onClick={(e) => handleRemoveTag(e, String(val))}
                                >
                                    <X className="h-3 w-3" />
                                </div>
                            </Badge>
                        );
                    })}
                </div>
            );
        }

        // Single Mode display
        const activeLabel = options.find((o) => o.value === field.value)?.label || field.value;
        return <span className="truncate capitalize">{activeLabel}</span>;
    };

    return (
        <div className={cn("w-full space-y-1", className)}>
            {label && (
                <label className="font-semibold text-sm">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-between border-gray-600 min-h-10 h-auto rounded-md px-3 text-sm font-normal",
                            fieldState.error && "border-red-500",
                        )}
                    >
                        {renderTriggerContent()}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={`Cari atau buat ${label?.toLowerCase()} baru...`}
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                        <CommandList>
                            {/* Create New Option */}
                            {searchValue &&
                                !options.some(
                                    (o) => o.label.toLowerCase() === searchValue.toLowerCase(),
                                ) && (
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={handleCreate}
                                            className="cursor-pointer"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Buat:{" "}
                                            <span className="font-bold ml-1">"{searchValue}"</span>
                                        </CommandItem>
                                    </CommandGroup>
                                )}

                            <CommandGroup className="max-h-64 overflow-auto">
                                {options
                                    .filter((o) =>
                                        o.label.toLowerCase().includes(searchValue.toLowerCase()),
                                    )
                                    .map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => handleSelect(String(option.value))}
                                            className="capitalize cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedValues.includes(String(option.value))
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                            <CommandEmpty className="p-4 text-xs text-center text-muted-foreground">
                                {isError ? "Gagal memuat data" : "Tidak ditemukan"}
                            </CommandEmpty>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {fieldState.error?.message && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
            )}
        </div>
    );
}
