"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon, RefreshCcw, Settings2, Trash2, Star, Plus, MapPin } from "lucide-react";

import { useAddress, useFormAddress } from "@/app/(application)/account/address/server/use.address";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { WarningAlert } from "@/components/ui/warning.alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Badge } from "@/components/ui/badge";

export function AddressAccount() {
    const { list } = useAddress();
    const router = useRouter();

    const isMainLoading = list.isLoading || list.isRefetching;
    const hasAddresses = list.data?.addresses && list.data.addresses.length > 0;

    return (
        <Card className="px-0 border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight">Alamat Simpanan</h3>
                    <CardDescription>Atur alamat pengiriman belanja Anda</CardDescription>
                </div>
                {/* Tombol Tambah diletakkan di Header agar selalu terlihat */}
                {!list.isError && !isMainLoading && (
                    <Button size="sm" onClick={() => router.push("/account/address")}>
                        <Plus size={16} className="mr-1" />
                        Tambah
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {list.isError ? (
                    <WarningAlert title="Gagal Memuat Alamat">
                        <div className="flex flex-col gap-3">
                            <p className="text-sm">
                                Terjadi kendala saat mengambil data dari server.
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-fit"
                                onClick={() => list.refetch()}
                                disabled={list.isRefetching}
                            >
                                {list.isRefetching ? (
                                    <RefreshCcw className="animate-spin mr-2" size={14} />
                                ) : null}
                                Coba Lagi
                            </Button>
                        </div>
                    </WarningAlert>
                ) : isMainLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                ) : !hasAddresses ? (
                    /* Empty State: Tampilan saat user memang belum punya alamat */
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-gray-50/50">
                        <div className="bg-gray-200 p-3 rounded-full mb-4">
                            <MapPin className="text-gray-400" size={24} />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            Belum ada alamat tersimpan
                        </p>
                        <p className="text-xs text-gray-400 mb-5">
                            Tambahkan alamat untuk memudahkan pengiriman.
                        </p>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => router.push("/account/address")}
                        >
                            Buat Alamat Pertama
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Daftar Alamat ({list.data?.len}/3)
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {list.data?.addresses.map((address) => (
                                <AddressCard
                                    key={address.id}
                                    address={address}
                                    onEdit={() => router.push(`/account/address/${address.id}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// Sub-komponen Card Alamat
function AddressCard({ address, onEdit }: { address: any; onEdit: () => void }) {
    return (
        <Card
            className={`overflow-hidden ${address.primary ? "border-amber-200 bg-amber-50/30" : ""}`}
        >
            <CardHeader className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold uppercase">{address.name}</h4>
                        {address.primary && (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none text-[10px] h-5 px-1.5">
                                <Star className="fill-current mr-1" size={10} />
                                UTAMA
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed">
                    <p className="font-medium text-gray-900 mb-1">
                        {address.recipient_name || "Penerima"}
                    </p>
                    <p>{address.phone || "No. Telepon tidak ada"}</p>
                    <p>
                        {`Kel. ${address.sub_district}, Kec. ${address.district}, ${address.city}, ${address.province}, ${address.country} - ${address.postal_code}`}
                    </p>
                </div>

                <CardFooter className="gap-2 p-0 pt-4 flex-row flex-wrap">
                    {!address.primary && <ChangePrimaryAddress id={address.id} />}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onEdit}
                        className="flex-1 lg:flex-none h-8 text-xs"
                    >
                        <Settings2 size={14} className="mr-1.5" />
                        Edit
                    </Button>

                    <DeleteAddress id={address.id} />
                </CardFooter>
            </CardHeader>
        </Card>
    );
}

// Komponen Hapus
function DeleteAddress({ id }: { id: number }) {
    const { deleted } = useFormAddress(id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs"
                >
                    <Trash2 size={14} className="mr-1.5" />
                    Hapus
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Hapus Alamat</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat
                        dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" size="sm">
                            Batal
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleted.mutateAsync()}
                        disabled={deleted.isPending}
                    >
                        {deleted.isPending ? (
                            <Loader2Icon className="animate-spin" size={16} />
                        ) : (
                            "Ya, Hapus"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Komponen Ganti Alamat Utama
function ChangePrimaryAddress({ id }: { id: number }) {
    const { changePrimary } = useFormAddress(id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 lg:flex-none h-8 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                    <Star size={14} className="mr-1.5" />
                    Jadikan Utama
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Ubah Alamat Utama</DialogTitle>
                    <DialogDescription>
                        Alamat ini akan digunakan sebagai tujuan pengiriman default Anda.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" size="sm">
                            Batal
                        </Button>
                    </DialogClose>
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                        size="sm"
                        onClick={() => changePrimary.mutateAsync()}
                        disabled={changePrimary.isPending}
                    >
                        {changePrimary.isPending ? (
                            <Loader2Icon className="animate-spin" size={16} />
                        ) : (
                            "Konfirmasi"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
