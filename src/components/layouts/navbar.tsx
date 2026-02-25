import { useSidebar } from "@/components/ui/sidebar";
import { Kbd } from "../ui/kbd";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Brand } from "../ui/brand";
// Di Navbar component
export function Navbar() {
    const { toggleSidebar, state } = useSidebar(); // state bisa 'expanded' atau 'collapsed'

    return (
        <nav className="flex items-center px-3 py-4 justify-between bg-gray-50">
            <div className="flex items-center justify-start gap-2">
                <Button size={"icon"} onClick={toggleSidebar} variant={"teal"}>
                    {state === "expanded" ? (
                        <>
                            <PanelLeftClose className="size-5 md:size-4" />
                        </>
                    ) : (
                        <>
                            <PanelRightClose className="size-5 md:size-4" />
                        </>
                    )}
                </Button>
                <div className="block md:hidden">
                    <Brand />
                </div>
            </div>

            <div>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    className="text-gray-500 hover:text-gray-500"
                >
                    v{process.env.NEXT_PUBLIC_APP_VERSION}
                </Button>
            </div>
        </nav>
    );
}
