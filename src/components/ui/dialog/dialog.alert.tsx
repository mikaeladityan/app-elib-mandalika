import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../dialog";
import { Button } from "../button";
import { cn } from "@/lib/utils";

interface DialogAlertProps {
    label: React.ReactNode;
    title: string;
    children: React.ReactNode;
    onClick?: () => Promise<void>;
    className?: string;
}

export function DialogAlert({ children, label, title, onClick, className }: DialogAlertProps) {
    return (
        <Dialog>
            <DialogTrigger
                className={cn(
                    "flex items-center justify-center gap-2 p-3 py-2 rounded-lg bg-amber-500 text-sm border border-amber-500 hover:bg-amber-600/80 transition-all ease-in-out duration-200 cursor-pointer",
                    className,
                )}
            >
                {label}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>

                    {children}
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <Button className="cursor-pointer" onClick={onClick} variant={"teal"}>
                        Konfirmasi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
