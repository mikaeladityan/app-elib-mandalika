"use client";

import { Input } from "../input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { ReactNode } from "react";
import { Controller } from "react-hook-form";

type PropsInputForm = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    showVisibilityToggle?: boolean;
    onToggleVisibility?: () => void;
    isVisible?: boolean;
    isCurrency?: boolean;
    suffix?: string | ReactNode;
};

export function InputForm({
    name,
    control,
    label,
    error,
    className,
    showVisibilityToggle = false,
    onToggleVisibility,
    isVisible,
    isCurrency = false,
    suffix,
    ...props
}: React.ComponentProps<"input"> & PropsInputForm) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, ...field } }) => {
                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    let val = e.target.value;

                    if (props.type === "number") {
                        // Mengizinkan input kosong agar tidak langsung jadi 0
                        onChange(val === "" ? "" : Number(val));
                    } else if (isCurrency) {
                        // Menghapus semua karakter non-digit untuk simpan angka murni
                        const numericValue = val.replace(/\D/g, "");
                        onChange(numericValue === "" ? "" : Number(numericValue));
                    } else {
                        onChange(val);
                    }
                };

                // Formatter untuk tampilan mata uang (IDR)
                const displayValue =
                    isCurrency && value !== "" && value !== undefined
                        ? new Intl.NumberFormat("id-ID").format(Number(value))
                        : (value ?? "");

                return (
                    <div className="w-full space-y-1">
                        <label htmlFor={name} className="font-semibold text-sm">
                            {label || name}{" "}
                            {props.required && <span className="text-red-500">*</span>}
                        </label>

                        <div className="relative">
                            <Input
                                {...field}
                                {...props}
                                id={name}
                                value={displayValue}
                                onChange={handleInputChange}
                                // SOLUSI 1: Mematikan scroll wheel agar angka tidak berubah
                                onWheel={(e) => {
                                    if (props.type === "number") {
                                        e.currentTarget.blur();
                                    }
                                }}
                                className={cn(
                                    "border-gray-600 pr-10 rounded-sm",
                                    // SOLUSI 2: Menghilangkan panah naik-turun (spinner)
                                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    className,
                                    error && "border-red-500",
                                )}
                            />

                            {/* Render Suffix (seperti 'Hari' atau 'Kg') */}
                            {suffix && !showVisibilityToggle && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                                    {suffix}
                                </span>
                            )}

                            {showVisibilityToggle && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={onToggleVisibility}
                                >
                                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        </div>

                        {error?.message && (
                            <p className="text-red-500 text-xs mt-1">{error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}
