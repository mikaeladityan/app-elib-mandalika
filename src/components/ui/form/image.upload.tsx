"use client";

import React, { useState } from "react";
import { useController, Control } from "react-hook-form";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
    name: string;
    control: Control<any>;
    label?: string;
    description?: string;
}

export function ImageUploadForm({ name, control, label, description }: ImageUploadProps) {
    const { field, fieldState } = useController({ name, control });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // SIMULASI UPLOAD: Ganti bagian ini dengan API Upload Anda
        // Contoh: const url = await uploadToCloudinary(file);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Simulasi delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const fakeUrl = URL.createObjectURL(file); // Sementara pakai blob URL
            field.onChange(fakeUrl);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-bold">{label}</label>}
            <div className="flex items-center gap-4">
                {field.value ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                        <Image
                            src={field.value}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            width={200}
                            height={200}
                        />
                        <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="absolute right-1 top-1 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-500 transition hover:border-gray-800",
                            fieldState.error && "border-rose-500 bg-rose-50",
                        )}
                        onClick={() => document.getElementById(`file-input-${name}`)?.click()}
                    >
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                            <>
                                <ImagePlus className="h-6 w-6 text-gray-400" />
                                <span className="text-[10px] text-gray-400">Pilih Foto</span>
                            </>
                        )}
                    </div>
                )}
                <input
                    id={`file-input-${name}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                        {description || "Max 2MB, format JPG/PNG"}
                    </p>
                    {fieldState.error && (
                        <p className="mt-1 text-xs text-rose-500">{fieldState.error.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
