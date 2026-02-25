"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    useAddress,
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

export function UpdateAddress() {
    const { id } = useParams<{ id: string }>();
    const addressId = Number(id);

    const { detail } = useAddress(addressId);
    const { update } = useFormAddress(addressId);

    const form = useForm<Partial<RequestAddressDTO>>({
        resolver: zodResolver(RequestAddressSchema.partial()),
        defaultValues: DEFAULT_FORM_VALUES,
    });

    const [regionState, setRegionState] = useState<RegionState>({});

    const {
        province: provinceOptions,
        city: cityOptions,
        district: districtOptions,
        subdistrict: subdistrictOptions,
        isLoading,
        isError,
    } = useApiAddress(regionState.province_id, regionState.city_id, regionState.district_id);

    const findRegionId = (list?: { id: number; text: string }[], value?: string) =>
        list?.find((r) => r.text === value)?.id;

    useEffect(() => {
        if (!detail.data) return;

        form.reset({
            primary: detail.data.primary ?? false,
            name: detail.data.name ?? "",
            street: detail.data.street ?? "",
            province: detail.data.province ?? "",
            city: detail.data.city ?? "",
            district: detail.data.district ?? "",
            sub_district: detail.data.sub_district ?? "",
            country: detail.data.country ?? "Indonesia",
            postal_code: detail.data.postal_code ?? "",
            notes: detail.data.notes ?? "",
        });
    }, [detail.data, form]);

    useEffect(() => {
        if (!detail.data?.province || !provinceOptions?.length) return;
        const id = findRegionId(provinceOptions, detail.data.province);
        if (id) setRegionState((p) => ({ ...p, province_id: id }));
    }, [detail.data?.province, provinceOptions]);

    useEffect(() => {
        if (!detail.data?.city || !cityOptions?.length) return;
        const id = findRegionId(cityOptions, detail.data.city);
        if (id) setRegionState((p) => ({ ...p, city_id: id }));
    }, [detail.data?.city, cityOptions]);

    useEffect(() => {
        if (!detail.data?.district || !districtOptions?.length) return;
        const id = findRegionId(districtOptions, detail.data.district);
        if (id) setRegionState((p) => ({ ...p, district_id: id }));
    }, [detail.data?.district, districtOptions]);

    useEffect(() => {
        if (!detail.data?.sub_district || !subdistrictOptions?.length) return;
        const id = findRegionId(subdistrictOptions, detail.data.sub_district);
        if (id) setRegionState((p) => ({ ...p, sub_district_id: id }));
    }, [detail.data?.sub_district, subdistrictOptions]);

    const onSubmit = async (data: Partial<RequestAddressDTO>) => {
        await update.mutateAsync(data);
    };

    const resetAll = () => {
        if (detail.data) {
            form.reset(detail.data);
        }
    };

    return (
        <section className="grid grid-cols-1 space-y-3">
            <h1 className="font-semibold text-lg md:text-xl">Ubah Alamat</h1>

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
                        disabled={update.isPending}
                    >
                        <RefreshCwIcon className="mr-2" size={16} />
                        Reset
                    </Button>
                </CardHeader>

                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        <InputForm
                            required
                            control={form.control}
                            name="name"
                            label="Nama Alamat"
                        />

                        <InputForm required control={form.control} name="street" label="Jalan" />

                        <Combobox
                            label="Provinsi"
                            options={
                                provinceOptions?.map((p) => ({
                                    value: p.id,
                                    label: p.text,
                                })) || []
                            }
                            placeholder=""
                            value={regionState.province_id}
                            isLoading={isLoading}
                            isError={isError}
                            onSelect={(value, label) => {
                                form.setValue("province", label || "");
                                setRegionState({
                                    province_id: Number(value),
                                });
                            }}
                            sendLabel
                        />

                        {regionState.province_id && (
                            <Combobox
                                label="Kota/Kabupaten"
                                options={
                                    cityOptions?.map((c) => ({
                                        value: c.id,
                                        label: c.text,
                                    })) || []
                                }
                                placeholder=""
                                value={regionState.city_id}
                                isLoading={isLoading}
                                isError={isError}
                                onSelect={(value, label) => {
                                    form.setValue("city", label || "");
                                    setRegionState((p) => ({
                                        ...p,
                                        city_id: Number(value),
                                        district_id: undefined,
                                        sub_district_id: undefined,
                                    }));
                                }}
                                sendLabel
                            />
                        )}

                        {regionState.city_id && (
                            <Combobox
                                label="Kecamatan"
                                options={
                                    districtOptions?.map((d) => ({
                                        value: d.id,
                                        label: d.text,
                                    })) || []
                                }
                                placeholder=""
                                value={regionState.district_id}
                                isLoading={isLoading}
                                isError={isError}
                                onSelect={(value, label) => {
                                    form.setValue("district", label || "");
                                    setRegionState((p) => ({
                                        ...p,
                                        district_id: Number(value),
                                        sub_district_id: undefined,
                                    }));
                                }}
                                sendLabel
                            />
                        )}

                        {regionState.district_id && (
                            <Combobox
                                label="Kelurahan"
                                placeholder=""
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
                                    setRegionState((p) => ({
                                        ...p,
                                        sub_district_id: Number(value),
                                    }));
                                }}
                                sendLabel
                            />
                        )}

                        <InputForm control={form.control} name="postal_code" label="Kode Pos" />

                        <InputForm control={form.control} name="notes" label="Catatan" />

                        <FormField
                            control={form.control}
                            name="primary"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <FormLabel>Alamat Utama</FormLabel>
                                        <FormDescription>
                                            Digunakan sebagai alamat utama
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

                        <Button type="submit" disabled={update.isPending}>
                            {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </CardContent>
                </Form>
            </Card>
        </section>
    );
}
