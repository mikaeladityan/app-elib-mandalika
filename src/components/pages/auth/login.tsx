"use client";

import { LoginRequestDTO, LoginSchema } from "@/app/auth/server/auth.schema";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Key, Loader, Loader2, UserCheck } from "lucide-react";
import { InputForm } from "@/components/ui/form/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form/main";
import Link from "next/link";

export function Login() {
    const { isLoading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { login, isPending } = useFormAuth();

    const form = useForm<LoginRequestDTO>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (data: LoginRequestDTO) => {
        await login(data);
    };

    // To handle the remember state more cleanly
    const handleToggleRememberMe = () => {
        form.setValue("remember", !form.getValues("remember"));
    };

    if (isAuthenticated) {
        window.location.replace("/");
    }

    if (isLoading) return <Loader2 className="animate-spin" />;
    return (
        <Card className="w-10/12 xl:w-4/12 2xl:w-3/12 mx-auto">
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
                    </div>
                    <div className="w-full flex items-center justify-between gap-x-3">
                        {/* The "Remember Me" button has been completely refactored */}
                        <Button
                            variant={"ghost"}
                            type="button"
                            onClick={handleToggleRememberMe}
                            className="p-0 hover:no-underline group flex items-center gap-x-2"
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center w-3.5 h-3.5 border border-gray-500 rounded transition-colors",
                                    form.watch("remember") && "bg-black border-black p-2", // Change background when active
                                )}
                            >
                                <Check
                                    size={8} // Changed size to a specific value like 16
                                    strokeWidth={2}
                                    className={cn(
                                        "text-white transition-opacity", // Icon is white when active
                                        !form.watch("remember") && "opacity-0", // Hide the icon when not checked
                                    )}
                                />
                            </div>
                            <span
                                className={cn(
                                    "text-xs text-black",
                                    form.watch("remember") && "text-sky-600",
                                )}
                            >
                                Remember Me?
                            </span>
                        </Button>

                        {process.env.NEXT_PUBLIC_CAN_REGISTER && (
                            <Link
                                href={"/auth/register"}
                                className="text-xs text-sky-600 font-medium w-fit"
                            >
                                Register?
                            </Link>
                        )}
                    </div>

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
                                <Key size={18} /> Masuk
                            </>
                        )}
                    </Button>
                </Form>
            </CardContent>
        </Card>
    );
}
