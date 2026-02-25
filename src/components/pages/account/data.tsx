import { Card, CardContent, CardDescription, CardHeader } from "../../ui/card";
import { useState } from "react";
import {
    DialogHeader,
    DialogTitle,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "../../ui/dialog";
import { InputForm } from "../../ui/form/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form/main";

import { ChevronRight, Loader2Icon, SaveIcon } from "lucide-react";
import { AuthAccountResponseDTO } from "@/app/auth/server/auth.schema";
import { Button } from "@/components/ui/button";
import { useFormUser } from "@/app/(application)/account/user/server/use.user";
import { RequestUserDTO, UserSchema } from "@/app/(application)/account/user/server/user.schema";

export function DataAccount({ account }: { account?: AuthAccountResponseDTO }) {
    // const [update, setUpdate] = useState(false);

    return (
        <Card className="px-0 xl:col-span-2">
            <CardHeader>
                <h3 className="text-lg font-semibold">Pengaturan Akun</h3>
                <CardDescription>
                    Pastikan bahwa data yang anda masukan benar dan bukan merupakan data orang lain
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 space-y-3">
                <AccountForm account={account} />
                {/* <PasswordForm account={account} /> */}
                <Button
                    disabled
                    type="button"
                    className="w-full justify-between disabled:cursor-not-allowed"
                    variant={"secondary"}
                >
                    <span>Email</span>
                    <ChevronRight className="text-gray-500" size={16} />
                </Button>
            </CardContent>
        </Card>
    );
}

function AccountForm({ account }: { account?: AuthAccountResponseDTO }) {
    const { upsert, isPending } = useFormUser();
    const form = useForm<RequestUserDTO>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            first_name: account?.user?.first_name || "",
            last_name: account?.user?.last_name || "",
            phone: account?.user?.phone || "",
            whatsapp: account?.user?.whatsapp || "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: RequestUserDTO) => {
        await upsert(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" className="w-full justify-between" variant={"outline"}>
                    <span>Akun dan Sosial Media</span>
                    <ChevronRight className="text-gray-500" size={16} />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Update Akun</DialogTitle>
                    <DialogDescription>
                        Pastikan data tersebut valid dan bukan merupakan data orang lain!
                    </DialogDescription>
                </DialogHeader>

                {/* Form harus langsung di dalam DialogContent */}
                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <InputForm
                            disabled={isPending}
                            type="text"
                            name="first_name"
                            placeholder="Jhon"
                            control={form.control}
                            label="Nama Depan"
                            autoFocus
                            required
                            error={form.formState.errors.first_name}
                        />
                        <InputForm
                            disabled={isPending}
                            name="last_name"
                            placeholder="Doe"
                            control={form.control}
                            label="Nama Belakang"
                            error={form.formState.errors.last_name}
                        />
                        <InputForm
                            disabled={isPending}
                            name="phone"
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            control={form.control}
                            label="No Telp"
                            error={form.formState.errors.phone}
                        />
                        <InputForm
                            disabled={isPending}
                            name="whatsapp"
                            placeholder="08xxxxxxxxxx"
                            control={form.control}
                            label="No Whatsapp"
                            error={form.formState.errors.whatsapp}
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2Icon className="animate-spin mr-2" size={16} />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <SaveIcon className="mr-2" size={16} />
                                    Simpan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// function PasswordForm({ account }: { account?: AccountResDTO }) {
//     const { handleUpdatePassword, isPending } = useUpdatePassword();
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const form = useForm<ResetPasswordReqDTO>({
//         resolver: zodResolver(resetPasswordSchema),
//         defaultValues: {
//             email: account?.email || "",
//             password: "",
//             passwordConfirmation: "",
//         },
//     });

//     const onSubmit = async (data: ResetPasswordReqDTO) => {
//         await handleUpdatePassword(data);
//     };

//     return (
//         <Dialog>
//             <DialogTrigger asChild>
//                 <Button type="button" className="w-full justify-between" variant={"outline"}>
//                     <span>Keamanan</span>
//                     <IconChevronRight className="text-gray-500" size={16} />
//                 </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Pengaturan Password</DialogTitle>
//                     <DialogDescription>
//                         Pastikan data tersebut valid dan bukan merupakan data orang lain!
//                     </DialogDescription>
//                 </DialogHeader>

//                 {/* Form harus langsung di dalam DialogContent */}
//                 <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
//                     <div className="grid gap-4">
//                         <div className="space-y-2">
//                             <InputForm
//                                 disabled={isPending}
//                                 control={form.control}
//                                 name="password"
//                                 label="Password"
//                                 placeholder="Masukkan password"
//                                 type={showPassword ? "text" : "password"}
//                                 error={form.formState.errors.password}
//                                 showVisibilityToggle
//                                 onToggleVisibility={() => setShowPassword(!showPassword)}
//                                 isVisible={showPassword}
//                             />

//                             {form.watch("password") && (
//                                 <PasswordStrengthMeter password={form.watch("password")} />
//                             )}
//                         </div>

//                         <InputForm
//                             disabled={isPending}
//                             control={form.control}
//                             name="passwordConfirmation"
//                             label="Konfirmasi Password"
//                             placeholder="Konfirmasi password"
//                             type={showConfirmPassword ? "text" : "password"}
//                             error={form.formState.errors.passwordConfirmation}
//                             showVisibilityToggle
//                             onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
//                             isVisible={showConfirmPassword}
//                         />
//                     </div>
//                     <AlertDialogFooter className="mt-4">
//                         <DialogClose asChild>
//                             <Button type="button" variant="outline">
//                                 Batal
//                             </Button>
//                         </DialogClose>
//                         <Button type="submit" disabled={isPending}>
//                             {isPending ? (
//                                 <>
//                                     <Loader2Icon className="animate-spin mr-2" size={16} />
//                                     Menyimpan...
//                                 </>
//                             ) : (
//                                 <>
//                                     <SaveIcon className="mr-2" size={16} />
//                                     Simpan
//                                 </>
//                             )}
//                         </Button>
//                     </AlertDialogFooter>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// }
