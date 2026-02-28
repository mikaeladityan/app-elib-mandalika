"use client";

import React, { useState, useEffect } from "react";
import { useController, Control } from "react-hook-form";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    name: string;
    control: Control<any>;
    label?: string;
    description?: string;
    className?: string;
}

export function ImageUploadForm({
    name,
    control,
    label,
    description,
    className,
}: ImageUploadProps) {
    const { field, fieldState } = useController({ name, control });
    const [preview, setPreview] = useState<string | null>(null);

    // Sync preview jika ada default value atau saat field diriset
    useEffect(() => {
        if (!field.value) {
            setPreview(null);
        } else if (typeof field.value === "string") {
            setPreview(field.value); // Jika value adalah URL string (edit mode)
        }
    }, [field.value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simpan file asli ke react-hook-form
        field.onChange(file);

        // Buat preview URL untuk tampilan lokal
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        field.onChange(null);
        setPreview(null);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {label && <label className="font-semibold text-sm">{label}</label>}

            <div
                onClick={() => document.getElementById(`file-input-${name}`)?.click()}
                className={cn(
                    "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
                    "min-h-50 cursor-pointer bg-gray-50/50 hover:bg-gray-100/50",
                    fieldState.error
                        ? "border-rose-400 bg-rose-50/30"
                        : "border-gray-200 hover:border-gray-400",
                    preview ? "border-solid p-0 overflow-hidden" : "p-6",
                )}
            >
                {preview ? (
                    <>
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        {/* Overlay saat hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-xs font-medium bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
                                Ganti Gambar
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute right-2 top-2 z-10 rounded-full bg-rose-500 p-1.5 text-white shadow-lg hover:bg-rose-600 transition-transform active:scale-90"
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-3 rounded-full bg-white p-3 shadow-sm border border-gray-100 text-gray-400 group-hover:text-primary transition-colors">
                            <UploadCloud size={28} />
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Klik untuk upload</p>
                        <p className="mt-1 text-xs text-gray-400">
                            {description || "WEBP, JPG, atau PNG (Maks. 2MB)"}
                        </p>
                    </div>
                )}
            </div>

            {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
            )}

            <input
                id={`file-input-${name}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
