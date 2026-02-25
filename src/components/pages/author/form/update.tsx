"use client";
import {
    RequestAuthorDTO,
    RequestAuthorSchema,
} from "@/app/(application)/authors/server/author.schema";
import { useAuthor, useFormAuthor } from "@/app/(application)/authors/server/use.author";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { TextareaForm } from "@/components/ui/form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UpdateAuthor() {
    const { id } = useParams();
    const { detail } = useAuthor(undefined, Number(id));
    const { update, isPending } = useFormAuthor(Number(id));
    const form = useForm<Partial<RequestAuthorDTO>>({
        resolver: zodResolver(RequestAuthorSchema.partial()),
        defaultValues: {
            first_name: "",
            last_name: "",
            bio: "",
        },
    });

    useEffect(() => {
        if (detail.data) {
            form.reset({
                first_name: detail.data.first_name,
                last_name: detail.data.last_name,
                bio: detail.data.bio,
            });
        }
    }, [form.reset, detail.data]);

    const onSubmit = async (body: Partial<RequestAuthorDTO>) => {
        await update(body);
    };

    const isLoading = isPending || detail.isLoading;
    return (
        <Card className="w-full lg:w-6/12">
            <CardHeader>
                <CardTitle className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center justify-start gap-3">
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => window.history.back()}
                            className="cursor-pointer"
                        >
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-xl font-black uppercase italic tracking-wide">
                            Update Penulis {detail.data?.first_name}
                        </h1>
                    </div>

                    <Button
                        variant={"warning"}
                        className="cursor-pointer"
                        onClick={() => form.reset()}
                    >
                        <RefreshCcw /> Reset
                    </Button>
                </CardTitle>
            </CardHeader>
            <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-3">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-3">
                        <InputForm
                            name="first_name"
                            control={form.control}
                            label="Nama Depan"
                            required
                            autoFocus
                            disabled={isLoading}
                            placeholder="Jhon"
                            error={form.formState.errors.first_name}
                        />

                        <InputForm
                            name="last_name"
                            control={form.control}
                            label="Nama Belakang"
                            disabled={isLoading}
                            placeholder="Doe"
                            error={form.formState.errors.last_name}
                        />
                    </div>
                    <TextareaForm
                        name="bio"
                        control={form.control}
                        maxLength={200}
                        disabled={isLoading}
                        label="Biodata"
                    />
                </CardContent>
                <CardFooter className="mt-5">
                    <Button className="w-fit ms-auto" variant={"teal"} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save />} Simpan
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    );
}
