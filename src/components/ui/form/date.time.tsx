/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/form/date-time-picker.tsx
import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
// 💡 Import locale Indonesia
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";

type PropsDateTimeForm = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    className?: string;
    withTime?: boolean;
};

export function DateTimeForm({
    name,
    control,
    label,
    error,
    className,
    withTime = true,
    ...props
}: Omit<React.ComponentProps<typeof Calendar>, "selected" | "onSelect" | "mode"> &
    PropsDateTimeForm) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                // Format time as HH:mm (hours and minutes). HH:mm is already a 24-hour format common in Indonesia.
                const timeValue = field.value ? format(new Date(field.value), "HH:mm") : "00:00";

                const handleDateSelect = (date: Date | undefined) => {
                    if (!date) return;

                    // If we have a time value, combine it with the new date
                    if (timeValue) {
                        const [hours, minutes] = timeValue.split(":").map(Number);
                        date.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to zero
                    }

                    field.onChange(date);
                };

                const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newTime = e.target.value;

                    // If we have a date, update its time
                    if (field.value) {
                        const newDate = new Date(field.value);
                        const [hours, minutes] = newTime.split(":").map(Number);
                        newDate.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to zero
                        field.onChange(newDate);
                    } else {
                        // If no date is selected, create a new date with today's date and the selected time
                        const now = new Date();
                        const [hours, minutes] = newTime.split(":").map(Number);
                        now.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to zero
                        field.onChange(now);
                    }
                };

                return (
                    <div className={cn("w-full space-y-1", className)}>
                        {label && (
                            <label htmlFor={name} className="font-semibold text-sm">
                                {label} {props.required && <sup className="text-red-500">*</sup>}
                            </label>
                        )}

                        <div className="flex gap-2 w-fit">
                            <Popover>
                                <PopoverTrigger asChild className="rounded-lg">
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal border-gray-600",
                                            !field.value && "text-muted-foreground",
                                            error && "border-red-500",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            // 💡 Menerapkan locale Indonesia (id) untuk format tanggal (contoh: 23 Okt 2025)
                                            format(field.value, "PPP", { locale: id })
                                        ) : (
                                            <span>Pilih tanggal</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        onSelect={handleDateSelect}
                                        selected={field.value ? new Date(field.value) : undefined}
                                        captionLayout="dropdown"
                                        locale={id} // 💡 Menerapkan locale Indonesia (id) pada Calendar
                                        {...props}
                                    />
                                </PopoverContent>
                            </Popover>

                            {withTime && (
                                <div className="flex flex-col w-32">
                                    <Input
                                        type="time"
                                        value={timeValue}
                                        onChange={handleTimeChange}
                                        step="60" // 60 seconds = 1 minute
                                        className={cn(
                                            "h-full bg-background appearance-none",
                                            "[&::-webkit-calendar-picker-indicator]:hidden",
                                            "[&::-webkit-calendar-picker-indicator]:appearance-none border-black",
                                        )}
                                        disabled={!field.value}
                                    />
                                </div>
                            )}
                        </div>

                        {error?.message && (
                            <p className="text-red-500 text-xs mt-1">{error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}
