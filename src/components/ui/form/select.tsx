/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/form/select.tsx
"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils/index";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

// Re-export semua komponen select dari shadcn
export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Props untuk SelectForm
type SelectFormProps = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    description?: string;
    options?: Array<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
    className?: string;
    placeholder?: string;
    required?: boolean;
    onValueChange?: (value: string) => void;
} & React.ComponentProps<typeof SelectPrimitive.Root>;

// Komponen SelectForm yang terintegrasi dengan react-hook-form
export function SelectForm({
    name,
    control,
    label,
    error,
    description,
    options,
    placeholder = "Select an option",
    required = false,
    className,
    onValueChange,
    ...props
}: SelectFormProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                // Cari label dari value yang dipilih untuk ditampilkan
                const selectedOption = options?.find((option) => option.value === field.value);
                const displayValue = selectedOption?.label || placeholder;

                return (
                    <div className="w-full">
                        {/* Label */}
                        {label && (
                            <label
                                htmlFor={name}
                                className="font-semibold text-sm flex items-center"
                            >
                                {label} {required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}

                        {/* Select Component */}
                        <div className="relative">
                            <SelectPrimitive.Root
                                {...field}
                                {...props}
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    // Panggil onValueChange prop jika ada
                                    if (onValueChange) {
                                        onValueChange(value);
                                    }
                                    // Update field value
                                    field.onChange(value);
                                }}
                            >
                                <SelectPrimitive.Trigger
                                    id={name}
                                    className={cn(
                                        "border-gray-500 data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
                                        className,
                                        error && "border-destructive ring-destructive/20",
                                    )}
                                    aria-describedby={error ? `${name}-error` : undefined}
                                    aria-invalid={!!error}
                                >
                                    <SelectPrimitive.Value key={displayValue}>
                                        <span className="truncate">{displayValue}</span>
                                    </SelectPrimitive.Value>
                                    <SelectPrimitive.Icon asChild>
                                        <ChevronDownIcon className="size-4 opacity-50" />
                                    </SelectPrimitive.Icon>
                                </SelectPrimitive.Trigger>

                                <SelectPrimitive.Portal>
                                    <SelectPrimitive.Content
                                        className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md"
                                        position="popper"
                                        sideOffset={4}
                                    >
                                        <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                                            <ChevronUpIcon className="size-4" />
                                        </SelectPrimitive.ScrollUpButton>

                                        <SelectPrimitive.Viewport className="p-1">
                                            {options ? (
                                                options.map((option) => (
                                                    <SelectPrimitive.Item
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disabled}
                                                        className="focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
                                                    >
                                                        <span className="absolute right-2 flex size-3.5 items-center justify-center">
                                                            <SelectPrimitive.ItemIndicator>
                                                                <CheckIcon className="size-4" />
                                                            </SelectPrimitive.ItemIndicator>
                                                        </span>
                                                        <SelectPrimitive.ItemText>
                                                            {option.label}
                                                        </SelectPrimitive.ItemText>
                                                    </SelectPrimitive.Item>
                                                ))
                                            ) : (
                                                // Jika tidak ada options, render children (custom content)
                                                <SelectPrimitive.Group>
                                                    {props.children}
                                                </SelectPrimitive.Group>
                                            )}
                                        </SelectPrimitive.Viewport>

                                        <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                                            <ChevronDownIcon className="size-4" />
                                        </SelectPrimitive.ScrollDownButton>
                                    </SelectPrimitive.Content>
                                </SelectPrimitive.Portal>
                            </SelectPrimitive.Root>
                        </div>

                        {/* Deskripsi dan Error */}
                        <div className="min-h-5">
                            {description && !error && (
                                <p className="text-xs text-muted-foreground">{description}</p>
                            )}

                            {error?.message && (
                                <p
                                    id={`${name}-error`}
                                    className="text-red-500 text-xs"
                                    role="alert"
                                >
                                    {error.message}
                                </p>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
}

// Versi dengan grouping options
type GroupedSelectFormProps = Omit<SelectFormProps, "options"> & {
    groups: Array<{
        label?: string;
        options: Array<{
            value: string;
            label: string;
            disabled?: boolean;
        }>;
    }>;
};

export function GroupedSelectForm({
    name,
    control,
    label,
    error,
    description,
    groups,
    placeholder = "Select an option",
    required = false,
    className,
    onValueChange,
    ...props
}: GroupedSelectFormProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                // Cari label dari value yang dipilih
                let selectedLabel = placeholder;
                for (const group of groups) {
                    const found = group.options.find((option) => option.value === field.value);
                    if (found) {
                        selectedLabel = found.label;
                        break;
                    }
                }

                return (
                    <div className="w-full space-y-2">
                        {label && (
                            <label htmlFor={name} className="font-medium text-sm flex items-center">
                                {label} {required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}

                        <div className="relative">
                            <SelectPrimitive.Root
                                {...field}
                                {...props}
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    if (onValueChange) {
                                        onValueChange(value);
                                    }
                                    field.onChange(value);
                                }}
                            >
                                <SelectPrimitive.Trigger
                                    id={name}
                                    className={cn(
                                        "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
                                        className,
                                        error && "border-destructive ring-destructive/20",
                                    )}
                                >
                                    <SelectPrimitive.Value asChild>
                                        <span className="truncate">{selectedLabel}</span>
                                    </SelectPrimitive.Value>
                                    <SelectPrimitive.Icon asChild>
                                        <ChevronDownIcon className="size-4 opacity-50" />
                                    </SelectPrimitive.Icon>
                                </SelectPrimitive.Trigger>

                                <SelectPrimitive.Portal>
                                    <SelectPrimitive.Content className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md">
                                        {groups.map((group, index) => (
                                            <React.Fragment key={index}>
                                                {group.label && (
                                                    <SelectPrimitive.Label className="text-muted-foreground px-2 py-1.5 text-xs">
                                                        {group.label}
                                                    </SelectPrimitive.Label>
                                                )}
                                                {group.options.map((option) => (
                                                    <SelectPrimitive.Item
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disabled}
                                                        className="focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
                                                    >
                                                        <span className="absolute right-2 flex size-3.5 items-center justify-center">
                                                            <SelectPrimitive.ItemIndicator>
                                                                <CheckIcon className="size-4" />
                                                            </SelectPrimitive.ItemIndicator>
                                                        </span>
                                                        <SelectPrimitive.ItemText>
                                                            {option.label}
                                                        </SelectPrimitive.ItemText>
                                                    </SelectPrimitive.Item>
                                                ))}
                                                {index < groups.length - 1 && (
                                                    <SelectPrimitive.Separator className="bg-border -mx-1 my-1 h-px" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </SelectPrimitive.Content>
                                </SelectPrimitive.Portal>
                            </SelectPrimitive.Root>
                        </div>

                        <div className="min-h-5">
                            {description && !error && (
                                <p className="text-xs text-muted-foreground">{description}</p>
                            )}

                            {error?.message && (
                                <p className="text-red-500 text-xs">{error.message}</p>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
}

// // Basic select with options
// <SelectForm
//   name="category"
//   control={control}
//   label="Category"
//   options={[
//     { value: "tech", label: "Technology" },
//     { value: "design", label: "Design" },
//     { value: "business", label: "Business" },
//   ]}
//   placeholder="Select a category"
//   required={true}
//   description="Choose a category for your post"
// />

// // Grouped select
// <GroupedSelectForm
//   name="country"
//   control={control}
//   label="Country"
//   groups={[
//     {
//       label: "Asia",
//       options: [
//         { value: "id", label: "Indonesia" },
//         { value: "sg", label: "Singapore" },
//       ]
//     },
//     {
//       label: "Europe",
//       options: [
//         { value: "uk", label: "United Kingdom" },
//         { value: "fr", label: "France" },
//       ]
//     }
//   ]}
//   placeholder="Select a country"
// />

// // Custom select (using children)
// <SelectForm
//   name="role"
//   control={control}
//   label="Role"
//   placeholder="Select a role"
// >
//   <SelectPrimitive.Group>
//     <SelectPrimitive.Label>Admin Roles</SelectPrimitive.Label>
//     <SelectPrimitive.Item value="admin">Administrator</SelectPrimitive.Item>
//     <SelectPrimitive.Item value="superadmin">Super Admin</SelectPrimitive.Item>
//     <SelectPrimitive.Separator />
//     <SelectPrimitive.Label>User Roles</SelectPrimitive.Label>
//     <SelectPrimitive.Item value="user">Regular User</SelectPrimitive.Item>
//     <SelectPrimitive.Item value="viewer">Viewer</SelectPrimitive.Item>
//   </SelectPrimitive.Group>
// </SelectForm>
