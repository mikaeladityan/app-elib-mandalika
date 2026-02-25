// src/app/(dashboard)/address/create.tsx
"use client";

import {
    useApiAddress,
    useFormAddress,
} from "@/app/(application)/account/address/server/use.address";
import {
    RequestAddressDTO,
    RequestAddressSchema,
} from "@/app/(application)/account/address/server/address.schema";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";
import { Combobox } from "@/components/ui/form/combobox";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { ArrowLeft, RefreshCwIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { LogData } from "@/components/log";

type RegionState = {
    province_id?: number;
    city_id?: number;
    district_id?: number;
    sub_district_id?: number;
};

const DEFAULT_FORM_VALUES: RequestAddressDTO = {
    primary: false,
    name: "",
    street: "",
    province: "",
    city: "",
    district: "",
    sub_district: "",
    country: "Indonesia",
    postal_code: "",
    notes: "",
};

export function CreateAddress() {
    /* ---------------------------- FORM SETUP ---------------------------- */
    const form = useForm<RequestAddressDTO>({
        resolver: zodResolver(RequestAddressSchema),
        defaultValues: DEFAULT_FORM_VALUES,
    });

    const { create } = useFormAddress();

    const onSubmit = async (data: RequestAddressDTO) => {
        await create.mutateAsync(data);
    };

    /* --------------------------- REGION STATE --------------------------- */
    const [regionState, setRegionState] = useState<RegionState>({});

    const resetRegionFrom = (level: keyof RegionState) => {
        if (level === "province_id") {
            return { city_id: undefined, district_id: undefined, sub_district_id: undefined };
        }
        if (level === "city_id") {
            return { district_id: undefined, sub_district_id: undefined };
        }
        if (level === "district_id") {
            return { sub_district_id: undefined };
        }
        return {};
    };

    const handleRegionChange = (level: keyof RegionState, value: number) => {
        setRegionState((prev) => ({
            ...prev,
            [level]: value,
            ...resetRegionFrom(level),
        }));
    };

    const resetAll = () => {
        form.reset(DEFAULT_FORM_VALUES);
        setRegionState({});
    };

    /* --------------------------- API REGIONS ---------------------------- */
    const {
        province: provinceOptions,
        city: cityOptions,
        district: districtOptions,
        subdistrict: subdistrictOptions,
        isLoading,
        isError,
    } = useApiAddress(regionState.province_id, regionState.city_id, regionState.district_id);

    return (
        <>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2" size={16} />
                        Kembali
                    </Button>

                    <Button
                        type="reset"
                        onClick={resetAll}
                        className="bg-amber-100 text-amber-600 hover:bg-amber-200"
                        disabled={create.isPending}
                    >
                        <RefreshCwIcon className="mr-2" size={16} />
                        Bersihkan
                    </Button>
                </CardHeader>

                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        {/* Basic Info */}
                        <InputForm
                            required
                            control={form.control}
                            name="name"
                            label="Nama Alamat"
                            placeholder="Rumah, Kantor, Apartemen"
                        />

                        <InputForm
                            required
                            control={form.control}
                            name="street"
                            label="Jalan"
                            placeholder="Jalan Indonesia No XX"
                        />

                        {/* Region Select */}
                        <Combobox
                            label="Provinsi"
                            placeholder="Pilih Provinsi"
                            options={
                                provinceOptions?.map((p) => ({ value: p.id, label: p.text })) || []
                            }
                            value={regionState.province_id}
                            isLoading={isLoading}
                            isError={isError}
                            onSelect={(value, label) => {
                                form.setValue("province", label || "");
                                handleRegionChange("province_id", Number(value));
                            }}
                            sendLabel
                        />

                        {regionState.province_id && (
                            <Combobox
                                label="Kota/Kabupaten"
                                placeholder="Pilih Kota/Kabupaten"
                                options={
                                    cityOptions?.map((c) => ({ value: c.id, label: c.text })) || []
                                }
                                value={regionState.city_id}
                                isLoading={isLoading}
                                isError={isError}
                                onSelect={(value, label) => {
                                    form.setValue("city", label || "");
                                    handleRegionChange("city_id", Number(value));
                                }}
                                sendLabel
                            />
                        )}

                        {regionState.city_id && (
                            <Combobox
                                label="Kecamatan"
                                placeholder="Pilih Kecamatan"
                                options={
                                    districtOptions?.map((d) => ({ value: d.id, label: d.text })) ||
                                    []
                                }
                                value={regionState.district_id}
                                isLoading={isLoading}
                                isError={isError}
                                onSelect={(value, label) => {
                                    form.setValue("district", label || "");
                                    handleRegionChange("district_id", Number(value));
                                }}
                                sendLabel
                            />
                        )}

                        {regionState.district_id && (
                            <Combobox
                                label="Kelurahan"
                                placeholder="Pilih Kelurahan"
                                options={
                                    subdistrictOptions?.map((s) => ({
                                        value: s.id,
                                        label: s.text,
                                    })) || []
                                }
                                value={regionState.sub_district_id}
                                isLoading={isLoading}
                                isError={isError}
                                onSelect={(value, label) => {
                                    form.setValue("sub_district", label || "");
                                    setRegionState((prev) => ({
                                        ...prev,
                                        sub_district_id: Number(value),
                                    }));
                                }}
                                sendLabel
                            />
                        )}

                        {/* Extra */}
                        <InputForm
                            control={form.control}
                            name="postal_code"
                            label="Kode Pos"
                            placeholder="12345"
                        />

                        <InputForm
                            control={form.control}
                            name="notes"
                            label="Catatan (Opsional)"
                            placeholder="Patokan, warna rumah, dll"
                        />

                        {/* Primary Address (moved to bottom) */}
                        <FormField
                            control={form.control}
                            name="primary"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <FormLabel>Jadikan Alamat Utama</FormLabel>
                                        <FormDescription>
                                            Digunakan sebagai alamat utama pengiriman
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={create.isPending}>
                            {create.isPending ? "Menyimpan..." : "Simpan Alamat"}
                        </Button>
                    </CardContent>
                </Form>
            </Card>

            <LogData data={form.watch()} />
        </>
    );
}
