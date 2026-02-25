"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";

import { RequestUserDTO, UserSchema } from "@/app/(application)/account/user/server/user.schema";
import { useAuth } from "@/app/auth/server/use.auth";
import { useFormUser } from "@/app/(application)/account/user/server/use.user";

export function User() {
    const { account, isLoading } = useAuth();
    const { upsert, isPending } = useFormUser();

    const isUpdate = !!account?.user;

    const form = useForm<RequestUserDTO>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            whatsapp: "",
            photo: undefined,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (account?.user) {
            reset({
                first_name: account.user.first_name ?? "",
                last_name: account.user.last_name ?? "",
                phone: account.user.phone ?? "",
                whatsapp: account.user.whatsapp ?? "",
                photo: undefined,
            });
        }
    }, [account, reset]);

    const onSubmit = async (data: RequestUserDTO) => {
        await upsert({ ...data, photo: undefined });
    };

    if (isLoading) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between max-w-xl">
                <div>
                    <h2 className="text-xl font-semibold">Profil Akun</h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola dan perbarui informasi dasar akun Anda
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>
            </header>

            {/* Form */}
            <Form methods={form} onSubmit={handleSubmit(onSubmit)}>
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-base">
                            {isUpdate ? "Perbarui Profil" : "Lengkapi Profil"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <InputForm
                            name="first_name"
                            label="Nama Depan"
                            placeholder="Contoh: Andi"
                            control={control}
                            error={errors.first_name}
                            required
                        />

                        <InputForm
                            name="last_name"
                            label="Nama Belakang"
                            placeholder="Contoh: Wijaya"
                            control={control}
                            error={errors.last_name}
                        />

                        <InputForm
                            name="phone"
                            label="No. HP"
                            placeholder="08xxxxxxxxxx"
                            control={control}
                            error={errors.phone}
                        />

                        <InputForm
                            name="whatsapp"
                            label="No. Whatsapp"
                            placeholder="08xxxxxxxxxx"
                            control={control}
                            error={errors.whatsapp}
                        />
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending
                                ? "Menyimpan..."
                                : isUpdate
                                  ? "Simpan Perubahan"
                                  : "Simpan Profil"}
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </div>
    );
}
