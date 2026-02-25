import { useCompany } from "@/app/(application)/companies/server/use.company";
import { BookAudio, BookX, Hospital, Shirt } from "lucide-react";
import Image from "next/image";

export function Brand() {
    const company = useCompany();
    return company.data?.logo ? (
        <div className="flex items-end justify-center gap-2">
            <Image
                src={company.data.logo}
                alt={company.data.name}
                width={200}
                height={200}
                className="w-10 h-10 object-cover object-center"
            />
            <div>
                <h1 className="leading-0 font-black uppercase tracking-wide">
                    {company.data.name}
                </h1>
                <small className="italic text-[9px] text-gray-600 truncate">
                    {company.data.legal_name}
                </small>
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-start gap-1">
            <BookAudio size={30} className="text-emerald-600" />
            <div className="mt-3">
                <h1 className="font-semibold text-emerald-600 leading-0">Mandalika</h1>
                <span className="text-[10px] text-gray-500 italic">by Laborare Indonesia</span>
            </div>
        </div>
    );
}
