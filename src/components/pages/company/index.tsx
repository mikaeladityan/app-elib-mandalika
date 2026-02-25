"use client";
import { useCompany } from "@/app/(application)/companies/server/use.company";
import { Calendar1, Edit3, Settings2 } from "lucide-react";
import { LogoBrand } from "./logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ParseDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRole } from "@/app/auth/server/use.auth";
import { useEffect } from "react";
export function Company() {
    const { isForbidden } = useRole(["DEVELOPER", "OWNER"]);

    const company = useCompany();
    const data = company.data;

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_NODE_ENV !== "development" && isForbidden) {
            window.location.replace("/");
        }
    }, [process.env, isForbidden]);

    return (
        <section className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Pengaturan Perusahaan</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola informasi profil, alamat legal, dan waktu operasional perusahaan
                        Anda.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column */}
                <div className="space-y-6 flex flex-col lg:flex-col gap-0 sm:gap-2 items-center">
                    <LogoBrand logo={data?.logo || "/blank.jpg"} companyId={company.data?.id} />
                    <div className="flex flex-col gap-2 w-full md:w-full">
                        <Link href={"/companies/edit"}>
                            <Button variant="outline" className="justify-start gap-2 w-full">
                                <Edit3 size={16} /> Pengaturan Perusahaan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{data?.name}</CardTitle>
                                <CardDescription>
                                    Informasi legal dan profil perusahaan
                                </CardDescription>
                            </div>
                            <Link href={"/companies/edit"}>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Settings2 size={16} />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Nama Legal
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {data?.legal_name || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Tanggal Berdiri
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Calendar1 size={14} className="text-muted-foreground" />
                                        <p className="text-sm">
                                            {ParseDate(data?.established_at || new Date())}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                                    Deskripsi
                                </p>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    {data?.description || "Tidak ada deskripsi."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
