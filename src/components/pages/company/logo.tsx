import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Building2 } from "lucide-react";
import { useChangeLogo } from "@/app/(application)/companies/server/use.company";
import { toast } from "sonner";

interface LogoBrandProps {
    logo: string | null;
    companyId?: string; // Tambahkan ini untuk validasi
}

export function LogoBrand({ logo, companyId }: LogoBrandProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const changeLogo = useChangeLogo();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Pastikan companyId ada sebelum mengizinkan aksi
    const isInvalid = !companyId;

    // Cleanup object URL untuk menghindari memory leak
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChangeLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Cegah jika company data belum ready
        if (isInvalid) {
            toast.error("Data perusahaan belum dimuat sempurna.");
            return;
        }

        // 2. Validasi Frontend (5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Logo terlalu besar. Maksimal 5MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        // 3. Generate Preview (Standardized with URL object)
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        try {
            // Pastikan mutasi Anda menerima objek yang benar sesuai useChangeLogo
            await changeLogo.mutateAsync({ file });
            // toast.success("Logo perusahaan berhasil diperbarui");
        } catch (error) {
            console.error("Failed to change logo:", error);
            toast.error("Gagal memperbarui logo");
            setPreviewUrl(null); // Reset preview jika gagal
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <Card className="p-0 overflow-hidden relative w-full lg:w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChangeLogo}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                disabled={changeLogo.isPending || isInvalid}
            />

            <CardHeader className="p-0 w-full aspect-square relative bg-muted">
                <Image
                    src={previewUrl || logo || "/blank.jpg"}
                    alt="Logo Brand"
                    fill
                    className="object-cover object-center"
                    priority
                    unoptimized={!!previewUrl}
                />
            </CardHeader>

            <CardContent className="absolute w-full mx-auto bottom-0 rounded text-white py-4 px-3 left-0 right-0 bg-black/40 backdrop-blur-sm flex items-center justify-between gap-x-2">
                <div className="flex items-center gap-x-3 truncate">
                    <div className="bg-secondary/20 p-2 rounded-md">
                        <Building2 className="size-5 text-white" />
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-medium">Company Logo</p>
                        <p className="text-[10px] text-gray-200">Format: PNG, JPG, WebP</p>
                    </div>
                </div>

                <Button
                    variant={"secondary"}
                    size="sm"
                    className="text-black flex items-center gap-1.5 h-8 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={changeLogo.isPending || isInvalid}
                >
                    {changeLogo.isPending ? (
                        "Uploading..."
                    ) : (
                        <>
                            Change <Camera size={16} />
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
