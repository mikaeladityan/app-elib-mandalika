"use client";

import { useAuth } from "@/app/auth/server/use.auth";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoAccount } from "./photo";
import { DataAccount } from "./data";
import { SessionAccount } from "./session";
import { AddressAccount } from "./address";

export function Account() {
    const { account, isLoading } = useAuth();

    return (
        <>
            <section className="grid grid-cols-1 space-y-3 p-1">
                {isLoading ? (
                    <LoaderSkeleton />
                ) : (
                    <>
                        <Greeting
                            email={account?.email || ""}
                            first_name={account?.user?.first_name || ""}
                            last_name={account?.user?.last_name || ""}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 items-start">
                            <PhotoAccount account={account} />
                            <div className="col-span-1 lg:col-span-1 xl:col-span-3 grid-cols-1 xl:grid-cols-2 grid gap-3 items-start">
                                <DataAccount account={account} />
                                <AddressAccount />
                                <SessionAccount />
                            </div>
                        </div>
                    </>
                )}
            </section>
        </>
    );
}

// Komponen Greeting terpisah
function Greeting({
    email,
    first_name,
    last_name,
}: {
    email: string;
    first_name: string;
    last_name: string;
}) {
    // Fungsi untuk mendapatkan ucapan berdasarkan waktu
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 3 && hour < 11) return "Pagi";
        if (hour >= 11 && hour < 15) return "Siang";
        if (hour >= 15 && hour < 19) return "Sore";
        return "Malam";
    };

    const greeting = getGreeting();
    const fullName = !first_name ? email.split("@")[0] : `${first_name} ${last_name}`.trim();

    return (
        <h1 className="text-lg text-wrap md:text-xl font-semibold text-gray-800">
            Selamat {greeting}
            {fullName && ","} {fullName}
        </h1>
    );
}

function LoaderSkeleton() {
    return (
        <>
            <Skeleton className="w-full lg:w-6/12 h-7 lg:h-8" />
            <Skeleton className="w-full h-72" />
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="w-full lg:w-6/12 h-7 lg:h-8" />
                    <CardDescription>
                        <Skeleton className="w-full lg:w-6/12 h-16 lg:h-10" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3">
                    <Skeleton className="w-full lg:w-6/12 h-7 lg:h-8" />
                    <Skeleton className="w-full lg:w-6/12 h-7 lg:h-8" />
                    <Skeleton className="w-full lg:w-6/12 h-7 lg:h-8" />
                </CardContent>
            </Card>
        </>
    );
}
