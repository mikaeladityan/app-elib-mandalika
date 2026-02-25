"use client";
import React, { useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { AuthBoundary } from "@/components/auth/boundary";
import { RequireAuth } from "@/components/auth/require.auth";
import { usePathname } from "next/navigation";
function SidebarAutoClose() {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar(); // API dari shadcn sidebar

    useEffect(() => {
        setOpenMobile(false); // tutup sidebar saat route berubah
    }, [pathname]);

    return null;
}
export default function ApplicationTemplate({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RequireAuth>
                <AuthBoundary />
                <SidebarProvider>
                    <SidebarAutoClose />
                    <AppSidebar />
                    <div className="w-screen space-y-5">
                        <Navbar />
                        <main className="flex-1 p-3 md:p-5">{children}</main>
                    </div>
                </SidebarProvider>
            </RequireAuth>
        </>
    );
}
