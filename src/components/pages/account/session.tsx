"use client";

import { useAccount, useLogout } from "@/app/(application)/account/server/use.account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { WarningAlert } from "@/components/ui/warning.alert";
import { ParseDateTime } from "@/lib/utils";
import { Loader2Icon, LogOutIcon, Monitor, RefreshCcw, Smartphone, Tablet } from "lucide-react";

export function SessionAccount() {
    const { activeSession } = useAccount();
    const isMainLoading =
        activeSession.isLoading || activeSession.isRefetching || activeSession.isFetching;

    // Function to detect device type from user agent
    const getDeviceInfo = (userAgent: string) => {
        if (!userAgent) return { type: "unknown", icon: <Monitor size={16} /> };

        if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
            return /tablet|ipad/i.test(userAgent)
                ? { type: "tablet", icon: <Tablet size={16} /> }
                : { type: "mobile", icon: <Smartphone size={16} /> };
        }
        return { type: "desktop", icon: <Monitor size={16} /> };
    };

    // Function to parse browser from user agent
    const getBrowserInfo = (userAgent: string) => {
        if (!userAgent) return "Unknown";

        if (userAgent.includes("Chrome")) return "Chrome";
        if (userAgent.includes("Firefox")) return "Firefox";
        if (userAgent.includes("Safari")) return "Safari";
        if (userAgent.includes("Edge")) return "Edge";
        if (userAgent.includes("Opera")) return "Opera";
        return "Unknown";
    };

    return (
        <Card className="px-0">
            {activeSession.isError ? (
                <CardContent>
                    <WarningAlert title="Gagal Memuat Sesi" className="w-full">
                        <div className="flex flex-col gap-3">
                            <p>
                                Terjadi kesalahan saat mengambil data sesi. Silakan coba lagi atau
                                hubungi layanan pelanggan.
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => activeSession.refetch()}
                                disabled={activeSession.isRefetching}
                            >
                                {activeSession.isRefetching ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCcw className="animate-spin" size={16} />
                                        Memuat ulang...
                                    </span>
                                ) : (
                                    "Coba Lagi"
                                )}
                            </Button>
                        </div>
                    </WarningAlert>
                </CardContent>
            ) : (
                <>
                    <CardHeader>
                        <CardTitle>Sesi Aktif</CardTitle>
                        <CardDescription>
                            Anda dapat masuk menggunakan akun ini maksimal 5 perangkat berbeda.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 space-y-3">
                        <div className="flex justify-between items-center gap-2 mt-2">
                            <div className="px-3 py-1 text-xs text-gray-500 bg-gray-100 border border-gray-500 rounded">
                                {activeSession?.data?.length}/5
                            </div>
                            <LogoutAllDevice />
                        </div>
                        {isMainLoading ? (
                            // Skeleton loader saat loading
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-4 p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-4/5" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activeSession?.data?.length === 0 ? (
                            // Tampilan saat belum ada sesi
                            <WarningAlert title="Tidak Ada Sesi Aktif" className="w-full">
                                <div className="flex flex-col gap-3">
                                    <span>Tidak ada sesi aktif yang ditemukan.</span>
                                </div>
                            </WarningAlert>
                        ) : (
                            // Tampilan daftar sesi
                            <div className="grid grid-cols-1 gap-4">
                                {activeSession?.data?.map((session) => {
                                    const deviceInfo = getDeviceInfo(session.userAgent || "");
                                    const browser = getBrowserInfo(session.userAgent || "");
                                    const lastActivity = new Date(session.lastActivity);
                                    const createdAt = new Date(session.createdAt);

                                    return (
                                        <Card key={session.sessionId} className="p-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-gray-100 rounded-full">
                                                            {deviceInfo.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium capitalize">
                                                                {deviceInfo.type}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                {browser}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {session.isCurrent && (
                                                        <Badge variant="default">Saat Ini</Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-1 text-sm">
                                                    <div className="flex items-center justify-start gap-2">
                                                        <p className="text-gray-500">IP Address:</p>
                                                        <p className="font-mono">
                                                            {session.ipAddress || "Unknown"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-start gap-2">
                                                        <p className="text-gray-500">Lokasi:</p>
                                                        <p>{session.location || "Unknown"}</p>
                                                    </div>
                                                    <div className="flex items-center justify-start gap-2">
                                                        <p className="text-gray-500">Dibuat:</p>
                                                        <p>{ParseDateTime(createdAt)}</p>
                                                    </div>
                                                    <div className="flex items-center justify-start gap-2">
                                                        <p className="text-gray-500">
                                                            Terakhir Aktif:
                                                        </p>
                                                        <p>{ParseDateTime(lastActivity)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </>
            )}
        </Card>
    );
}

function LogoutAllDevice() {
    const { logoutAll } = useLogout();

    const onSubmit = async () => {
        await logoutAll.mutateAsync();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant={"destructive"}>
                    <span>Keluar Semua Device</span>
                    <LogOutIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Keluar Semua Sesi Akun</DialogTitle>
                    <DialogDescription>
                        Apakah yakin untuk mengeluarkan semua sesi akun anda?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={() => onSubmit()} disabled={logoutAll.isPending}>
                        {logoutAll.isPending ? (
                            <>
                                <Loader2Icon className="animate-spin mr-2" size={16} />
                                Keluar...
                            </>
                        ) : (
                            <>
                                <LogOutIcon className="mr-2" size={16} />
                                Keluar
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
