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
    suffix?: string | ReactNode; // Tambahkan prop ini
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
                        onChange(val === "" ? "" : Number(val));
                    } else if (isCurrency) {
                        const numericValue = val.replace(/\D/g, "");
                        onChange(numericValue === "" ? "" : Number(numericValue));
                    } else {
                        onChange(val);
                    }
                };

                const displayValue =
                    isCurrency && value !== "" && value !== undefined
                        ? new Intl.NumberFormat("id-ID").format(Number(value))
                        : (value ?? "");

                return (
                    <div className="w-full space-y-1">
                        <label
                            htmlFor={name}
                            className="font-black italic tracking-wider uppercase text-gray-500 text-sm"
                        >
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
                                className={cn(
                                    "border-gray-600 pr-10 rounded-sm",
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
