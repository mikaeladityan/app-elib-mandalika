"use client";

import { RegisterRequestDTO, RegisterSchema } from "@/app/auth/server/auth.schema";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Loader2, UserCheck } from "lucide-react";
import { InputForm } from "@/components/ui/form/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Register() {
    const { isLoading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, isPending } = useFormAuth();

    const form = useForm<RegisterRequestDTO>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
        },
    });

    const onSubmit = async (data: RegisterRequestDTO) => {
        await register(data);
    };
    if (isAuthenticated) {
        window.location.replace("/");
    }

    if (isLoading) return <Loader className="animate-spin" />;

    return (
        <Card className="w-full md:w-6/12 lg:w-4/12 mx-auto">
            <CardContent>
                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <InputForm
                        required
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="jhon.doe@mail.com"
                        type="email"
                        autoFocus
                        error={form.formState.errors.email}
                    />
                    <div className="space-y-2">
                        <InputForm
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Masukkan password"
                            type={showPassword ? "text" : "password"}
                            error={form.formState.errors.password}
                            showVisibilityToggle
                            onToggleVisibility={() => setShowPassword(!showPassword)}
                            isVisible={showPassword}
                        />

                        {form.watch("password") && (
                            <PasswordStrengthMeter password={form.watch("password")} />
                        )}
                    </div>

                    <InputForm
                        control={form.control}
                        name="confirm_password"
                        label="Konfirmasi Password"
                        placeholder="Konfirmasi password"
                        type={showConfirmPassword ? "text" : "password"}
                        error={form.formState.errors.confirm_password}
                        showVisibilityToggle
                        onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                        isVisible={showConfirmPassword}
                    />

                    {/* <div className="w-full text-end">
                        <Link
                            href={"/auth/forgot-password"}
                            className="text-xs text-sky-600 font-medium w-full"
                        >
                            Lupa Password?
                        </Link>
                    </div> */}

                    <Button
                        disabled={isPending || !form.formState.isValid}
                        type="submit"
                        size={"sm"}
                        className="w-full mt-1"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Please wait
                            </>
                        ) : (
                            <>
                                <UserCheck size={18} /> Daftar
                            </>
                        )}
                    </Button>
                </Form>
            </CardContent>
        </Card>
    );
}

import { zxcvbn } from "@zxcvbn-ts/core";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form/main";

export const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const [strength, setStrength] = useState(0);
    const [feedback, setFeedback] = useState("");

    // State untuk menyimpan status setiap persyaratan
    const [requirements, setRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasSymbol: false,
        hasNumber: false,
        hasLetter: false,
    });

    useEffect(() => {
        if (!password) {
            setStrength(0);
            setFeedback("");
            setRequirements({
                minLength: false,
                hasUppercase: false,
                hasSymbol: false,
                hasNumber: false,
                hasLetter: false,
            });
            return;
        }

        // Validasi persyaratan tambahan
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);

        setRequirements({
            minLength,
            hasUppercase,
            hasSymbol,
            hasNumber,
            hasLetter,
        });

        // Hitung kekuatan password
        const result = zxcvbn(password);
        setStrength(result.score);

        // Tambahkan feedback khusus jika persyaratan tidak terpenuhi
        let customFeedback = "";
        if (!minLength) customFeedback += "Minimal 8 karakter. ";
        if (!hasUppercase) customFeedback += "Perlu huruf besar. ";
        if (!hasSymbol) customFeedback += "Perlu simbol. ";
        if (!hasNumber) customFeedback += "Perlu angka. ";
        if (!hasLetter) customFeedback += "Perlu huruf. ";

        setFeedback(
            customFeedback || result.feedback.warning || result.feedback.suggestions[0] || "",
        );
    }, [password]);

    const getStrengthText = () => {
        switch (strength) {
            case 1:
                return "Lemah";
            case 2:
                return "Cukup";
            case 3:
                return "Baik";
            case 4:
                return "Sangat Kuat";
            default:
                return "Sangat Lemah";
        }
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 1:
                return "bg-red-500";
            case 2:
                return "bg-yellow-500";
            case 3:
                return "bg-blue-500";
            case 4:
                return "bg-green-500";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <div className="mt-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                    Password:{" "}
                    <span
                        className={cn(
                            "font-medium",
                            strength === 0 && "text-gray-500",
                            strength === 1 && "text-red-500",
                            strength === 2 && "text-yellow-500",
                            strength === 3 && "text-blue-500",
                            strength === 4 && "text-green-500",
                        )}
                    >
                        {getStrengthText()}
                    </span>
                </span>
                <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1 w-3 rounded-full",
                                i <= strength ? getStrengthColor() : "bg-gray-200",
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Tampilkan daftar persyaratan */}
            <div className="grid grid-cols-2 gap-1 mt-2">
                <div
                    className={cn(
                        "text-xs",
                        requirements.minLength ? "text-green-500" : "text-gray-500",
                    )}
                >
                    {requirements.minLength ? "✓" : "✗"} Minimal 8 karakter
                </div>
                <div
                    className={cn(
                        "text-xs",
                        requirements.hasUppercase ? "text-green-500" : "text-gray-500",
                    )}
                >
                    {requirements.hasUppercase ? "✓" : "✗"} 1 Huruf besar
                </div>
                <div
                    className={cn(
                        "text-xs",
                        requirements.hasSymbol ? "text-green-500" : "text-gray-500",
                    )}
                >
                    {requirements.hasSymbol ? "✓" : "✗"} 1 Simbol
                </div>
                <div
                    className={cn(
                        "text-xs",
                        requirements.hasNumber ? "text-green-500" : "text-gray-500",
                    )}
                >
                    {requirements.hasNumber ? "✓" : "✗"} 1 Angka
                </div>
                <div
                    className={cn(
                        "text-xs",
                        requirements.hasLetter ? "text-green-500" : "text-gray-500",
                    )}
                >
                    {requirements.hasLetter ? "✓" : "✗"} 1 Huruf
                </div>
            </div>

            {feedback && <p className="text-xs text-gray-500 mt-2">{feedback}</p>}
        </div>
    );
};
