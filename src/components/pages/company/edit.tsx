"use client";
import {
    RequestCompanyDTO,
    RequestCompanySchema,
} from "@/app/(application)/companies/server/company.schema";
import { useCompany, useUpsertCompany } from "@/app/(application)/companies/server/use.company";
import { useRole } from "@/app/auth/server/use.auth";
import { LogData } from "@/components/log";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DateForm } from "@/components/ui/form/date";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { TextareaForm } from "@/components/ui/form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function EditCompany() {
    const { isForbidden } = useRole(["DEVELOPER", "OWNER"]);
    const company = useCompany();
    const upsert = useUpsertCompany();
    const form = useForm<RequestCompanyDTO>({
        resolver: zodResolver(RequestCompanySchema),
        defaultValues: {
            description: "",
            legal_name: "",
            name: "",
            established_at: new Date(),
            logo: null,
        },
    });

    useEffect(() => {
        if (company.data) {
            form.reset({
                name: company.data.name,
                description: company.data.description,
                established_at: company.data.established_at,
                legal_name: company.data.legal_name,
            });
        }
    }, [form.reset, company.data]);
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_NODE_ENV !== "development" && isForbidden) {
            window.location.replace("/");
        }
    }, [process.env, isForbidden]);

    const onSubmit = async (body: RequestCompanyDTO) => {
        await upsert.mutateAsync(body);
    };
    return (
        <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <Button
                        type="button"
                        className="w-fit"
                        variant={"outline"}
                        size={"sm"}
                        disabled={upsert.isPending}
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft /> Kembali
                    </Button>

                    <Button
                        disabled={upsert.isPending}
                        variant={"warning"}
                        type="button"
                        size={"sm"}
                    >
                        <RefreshCcw /> Reset
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InputForm
                        required
                        disabled={upsert.isPending}
                        control={form.control}
                        name="name"
                        label="Nama Perusahaan"
                        placeholder="Nama perusahaan..."
                        type="text"
                        autoFocus
                        error={form.formState.errors.name}
                    />
                    <div className="grid grid-cols-2 gap-5">
                        <InputForm
                            required
                            disabled={upsert.isPending}
                            control={form.control}
                            name="legal_name"
                            label="Nama Legal Perusahaan (PT/CV/etc)"
                            placeholder="PT/CV/etc..."
                            type="text"
                            error={form.formState.errors.legal_name}
                        />
                        <DateForm
                            disabled={upsert.isPending}
                            label="Tanggal Berdiri Perusahaan"
                            name="established_at"
                            control={form.control}
                            error={form.formState.errors.established_at}
                        />
                    </div>
                    <TextareaForm
                        disabled={upsert.isPending}
                        control={form.control}
                        name="description"
                        label="Deskripsi"
                        maxLength={200}
                        error={form.formState.errors.description}
                    />
                </CardContent>
                <CardFooter>
                    <Button
                        disabled={upsert.isPending}
                        type="submit"
                        className="ms-auto"
                        variant={"success"}
                    >
                        {upsert.isPending ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <Save /> Simpan
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
            <LogData data={form.formState.errors} />
        </Form>
    );
}
