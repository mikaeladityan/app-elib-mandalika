import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BulkActionBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    children?: React.ReactNode;
}

export function BulkActionBar({ selectedCount, onClearSelection, children }: BulkActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md border">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                    {selectedCount} item{selectedCount > 1 ? "s" : ""} dipilih
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClearSelection}
                    className="h-6 w-6 rounded-full"
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
            <div className="flex items-center gap-2">{children}</div>
        </div>
    );
}
