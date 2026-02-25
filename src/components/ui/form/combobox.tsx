"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../command";
export type ComboboxOption<T extends string | number> = {
    value: T;
    label: string;
};

interface ComboboxProps<T extends string | number> {
    label: string;
    placeholder: string;
    options: ComboboxOption<T>[];
    isLoading?: boolean;
    isError?: boolean;
    onSelect: (T: number | string, label?: string) => void; // Label menjadi optional
    refetch?: () => void;
    value?: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
    sendLabel?: boolean; // Prop baru untuk menentukan apakah label dikirim
    capitalize?: boolean;
    required?: boolean;
}

export function Combobox<T extends string | number>({
    label,
    placeholder,
    options,
    isLoading = false,
    isError = false,
    onSelect,
    value,
    error,
    refetch,
    sendLabel = false, // Default false untuk kompatibilitas
    capitalize = false,
    required = false,
}: ComboboxProps<T>) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
        if (searchTerm) {
            setFilteredOptions(
                options.filter((option) =>
                    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
                ),
            );
        } else {
            setFilteredOptions(options);
        }
    }, [searchTerm, options]);

    // Cari label yang sesuai dengan value
    const selectedOption = value
        ? options.find((option) => {
              // Handle perbandingan yang aman untuk number dan string
              if (typeof option.value === "number" && typeof value === "string") {
                  return option.value === Number(value);
              }
              if (typeof option.value === "string" && typeof value === "number") {
                  return Number(option.value) === value;
              }
              return option.value === value;
          })
        : null;

    const selectedLabel = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {isLoading ? (
                <Skeleton className="h-10 w-full" />
            ) : isError ? (
                <p className="text-red-500 text-sm">
                    Gagal memuat data {label.toLowerCase()}{" "}
                    <Button type="button" onClick={refetch} variant={"link"}>
                        Muat Ulang
                    </Button>
                </p>
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="border-gray-500 rounded-md">
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            <span className={cn("truncate", capitalize && "capitalize")}>
                                {selectedLabel}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder={`Cari ${label.toLowerCase()}...`}
                                value={searchTerm}
                                onValueChange={setSearchTerm}
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
                                        value={option.value.toString()}
                                        onSelect={() => {
                                            // Kirim label hanya jika sendLabel true
                                            onSelect(
                                                option.value,
                                                sendLabel ? option.label : undefined,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value
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

            {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    );
}
