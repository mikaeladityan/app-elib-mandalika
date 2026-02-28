"use client";
import {
    RequestAuthorDTO,
    RequestAuthorSchema,
} from "@/app/(application)/authors/server/author.schema";
import { useFormAuthor } from "@/app/(application)/authors/server/use.author";
import { LogData } from "@/components/log";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { TextareaForm } from "@/components/ui/form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export function CreateAuthor() {
    const query = useSearchParams();
    const ref = query.get("ref");
    const { create, isPending } = useFormAuthor(undefined, ref || undefined);
    const form = useForm<RequestAuthorDTO>({
        resolver: zodResolver(RequestAuthorSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            bio: "",
        },
    });

    const onSubmit = async (body: RequestAuthorDTO) => {
        await create(body);
    };

    return (
        <Card className="w-full lg:w-6/12">
            <LogData data={ref} />
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
                            Tambah Penulis Baru
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
                            disabled={isPending}
                            placeholder="Jhon"
                            error={form.formState.errors.first_name}
                        />

                        <InputForm
                            name="last_name"
                            control={form.control}
                            label="Nama Belakang"
                            disabled={isPending}
                            placeholder="Doe"
                            error={form.formState.errors.last_name}
                        />
                    </div>
                    <TextareaForm
                        name="bio"
                        control={form.control}
                        maxLength={200}
                        disabled={isPending}
                        label="Biodata"
                    />
                </CardContent>
                <CardFooter className="mt-5">
                    <Button className="w-fit ms-auto" variant={"teal"} disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : <Save />} Simpan
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    );
}
