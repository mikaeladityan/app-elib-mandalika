"use client";

import { BookHeart, PencilRuler, LibraryBig, Users } from "lucide-react";
import { useDashboardStats } from "@/app/(application)/server/use.dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function Main() {
    const { data: stats, isLoading } = useDashboardStats();

    return (
        <section className="">
            {/* Header Halaman */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Selamat datang di eLibrary</p>
            </header>

            {/* Konten Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Card Stats */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Buku</p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-gray-800">
                                    {stats?.total_books ?? 0}
                                </p>
                            )}
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <BookHeart className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Penulis</p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-gray-800">
                                    {stats?.total_authors ?? 0}
                                </p>
                            )}
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <PencilRuler className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Kategori</p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-gray-800">
                                    {stats?.total_categories ?? 0}
                                </p>
                            )}
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <LibraryBig className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Pengguna</p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-gray-800">
                                    {stats?.total_users ?? 0}
                                </p>
                            )}
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full">
                            <Users className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
