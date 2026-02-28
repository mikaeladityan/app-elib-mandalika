"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { STATUS } from "@/app/(application)/posts/server/post.schema";
import { useActionPost } from "@/app/(application)/posts/server/use.post";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Minimal manual wrapper for SmartText logic or just a basic Textarea since user doesn't want toolbars
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
    content: z.string().min(1, "Konten status tidak boleh kosong").max(5000, "Terlalu panjang"),
    status: z.enum(STATUS),
});

export function CreatePost() {
    const router = useRouter();
    const { push, isPushing } = useActionPost();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: "",
            status: "ACTIVE",
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        await push(values as any);
    };

    return (
        <div className="w-full space-y-6 pb-20 mt-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-xl"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Tulis Status Baru
                    </h1>
                    <p className="text-sm text-slate-500">
                        Bagikan pengumuman atau tulisan ke publik.
                    </p>
                </div>
            </div>

            <Card className="p-6 md:p-8 border-none shadow-xl shadow-slate-200/50 rounded-2xl bg-white">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700">Visibilitas</Label>
                        <Select
                            value={form.watch("status")}
                            onValueChange={(val: any) => form.setValue("status", val)}
                        >
                            <SelectTrigger className="w-full md:w-[200px] rounded-xl h-11 bg-slate-50 border-slate-200 focus:ring-slate-900 font-semibold text-slate-700">
                                <SelectValue placeholder="Pilih status privasi" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                <SelectItem value="ACTIVE" className="font-medium cursor-pointer">
                                    Publik (Active)
                                </SelectItem>
                                <SelectItem value="PENDING" className="font-medium cursor-pointer">
                                    Draft (Pending)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700 flex justify-between">
                            <span>Apa yang ingin Anda sampaikan?</span>
                            <span className="text-slate-400 font-medium text-xs">
                                Rich Text Format diizinkan (HTML Basic)
                            </span>
                        </Label>
                        <Textarea
                            placeholder="Mulai mengetik disini..."
                            className="min-h-[300px] resize-y rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900 focus-visible:border-slate-900 text-base p-6 shadow-sm placeholder:text-slate-300 transition-all font-medium leading-relaxed"
                            {...form.register("content")}
                        />
                        {form.formState.errors.content && (
                            <p className="text-sm text-red-500 font-medium mt-2 flex items-center gap-1">
                                <span>⚠️</span> {form.formState.errors.content.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button
                            type="submit"
                            disabled={isPushing}
                            className="rounded-xl px-8 h-12 bg-slate-900 hover:bg-black text-white font-bold shadow-md shadow-slate-200 transition-all hover:-translate-y-0.5"
                        >
                            {isPushing ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5 mr-2" />
                            )}
                            Publikasikan Status
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
