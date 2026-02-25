import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { AuthAccountResponseDTO } from "@/app/auth/server/auth.schema";
import { useFormAuth } from "@/app/auth/server/use.auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useChangePhotoUser } from "@/app/(application)/account/user/server/use.user";
import { toast } from "sonner";

export function PhotoAccount({ account }: { account?: AuthAccountResponseDTO }) {
    const fullName = `${account?.user?.first_name} ${account?.user?.last_name}`;
    const email = account?.email.split("@")[0];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isPending } = useFormAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const changePhoto = useChangePhotoUser();

    // Pastikan user ada sebelum mengizinkan interaksi
    const isUserInvalid = !account?.user || !account?.user;

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChangePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. CEGAH PROSES JIKA USER INVALID
        if (isUserInvalid) {
            toast.error("Data profil belum dimuat dengan sempurna.");
            return;
        }

        // 2. VALIDASI UKURAN FILE
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        try {
            await changePhoto.mutateAsync({ file });
            toast.success("Foto profil berhasil diperbarui");
        } catch (error) {
            console.error("Failed to change photo:", error);
            toast.error("Gagal mengunggah foto profil");
            setPreviewUrl(null);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <Card className="p-0 border border-gray-200 overflow-hidden relative w-full sm:w-6/12 lg:w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChangePhoto}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                // Disable input jika user invalid
                disabled={isPending || changePhoto.isPending || isUserInvalid}
            />

            <CardHeader className="w-full aspect-square relative bg-muted">
                <Image
                    src={previewUrl || account?.user?.photo || "/blank.jpg"}
                    alt={`photo-${email || "user"}`}
                    fill
                    className="object-cover object-center rounded-lg"
                    priority
                    unoptimized={!!previewUrl}
                />
            </CardHeader>

            <CardContent className="absolute w-full mx-auto bottom-0 rounded text-white py-4 px-3 left-0 right-0 bg-black/40 backdrop-blur-sm space-y-3">
                <div className="space-y-0.5">
                    <h2 className="text-xl font-medium truncate">
                        {account?.user?.first_name ? fullName : email || "Loading..."}
                    </h2>
                    <p className="truncate text-xs text-gray-200">
                        {account?.email || "No email available"}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-x-2">
                    <div className="flex items-center justify-start w-fit gap-x-3">
                        <Badge
                            variant={"secondary"}
                            className="flex items-center justify-center w-6 h-6 p-0"
                        >
                            <User className="text-green-500 size-4" />
                        </Badge>
                        <span className="capitalize font-medium text-sm">
                            {account?.role?.toLowerCase() || "Guest"}
                        </span>
                    </div>

                    <Button
                        variant={"secondary"}
                        size="sm"
                        className="text-black flex items-center gap-1.5 h-8 disabled:cursor-not-allowed"
                        onClick={() => fileInputRef.current?.click()}
                        // Disable tombol jika user invalid
                        disabled={isPending || changePhoto.isPending || isUserInvalid}
                    >
                        {changePhoto.isPending ? (
                            "Uploading..."
                        ) : (
                            <>
                                Change <Camera size={16} />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
