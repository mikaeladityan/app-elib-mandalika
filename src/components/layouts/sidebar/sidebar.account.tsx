"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { User2, Settings, CreditCard, LogOut, ChevronUp, Loader2 } from "lucide-react";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export function SidebarAccount() {
    const router = useRouter();
    const { logout, isPending } = useFormAuth();
    const { account, isLoading } = useAuth();

    const onLogout = async () => {
        await logout();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={isLoading}>
                        <SidebarMenuButton className="hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3 w-full">
                                {/* Avatar */}
                                {isLoading ? (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    </div>
                                ) : account?.user?.photo ? (
                                    <Image
                                        src={account.user.photo}
                                        width={32}
                                        height={32}
                                        alt={`photo ${account.email}`}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <User2 className="h-4 w-4" />
                                    </div>
                                )}

                                {/* Text */}
                                <div className="flex-1 min-w-0 text-left">
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="h-4 w-24 mb-1" />
                                            <Skeleton className="h-3 w-16" />
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium truncate capitalize">
                                                {account?.user?.first_name
                                                    ? `${account.user.first_name.toLowerCase()} ${account.user.last_name?.toLowerCase() ?? ""}`
                                                    : account?.email.split("@")[0]}
                                            </p>
                                            <p className="text-xs text-gray-500">{account?.role}</p>
                                        </>
                                    )}
                                </div>

                                {/* Chevron */}
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                ) : (
                                    <ChevronUp className="h-4 w-4" />
                                )}
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    {/* Dropdown */}
                    <DropdownMenuContent
                        side="top"
                        align="end"
                        className="w-[--radix-popper-anchor-width]"
                    >
                        <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => router.push("/account")}
                        >
                            <User2 className="mr-2 h-4 w-4" />
                            <span>Profil Saya</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem disabled={isLoading}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Pengaturan Akun</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem disabled={isLoading}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            disabled={isPending}
                            onClick={onLogout}
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="mr-2 h-4 w-4" />
                            )}
                            <span>Keluar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
