import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { sidebarConfig } from "./sidebar.config";
import { useState } from "react";
import { SidebarSectionRenderer } from "./sidebar.section";
import { SidebarAccount } from "./sidebar.account";
import { Brand } from "@/components/ui/brand";

export function AppSidebar() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    return (
        <Sidebar>
            <SidebarHeader className="px-4 pt-5">
                <Brand />
            </SidebarHeader>
            <SidebarContent>
                {sidebarConfig.map((section) => (
                    <SidebarSectionRenderer
                        key={section.key ?? section.label}
                        section={section}
                        open={section.key ? openSections[section.key] : undefined}
                        onToggle={
                            section.key
                                ? () =>
                                      setOpenSections((p) => ({
                                          ...p,
                                          [section.key!]: !p[section.key!],
                                      }))
                                : undefined
                        }
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarAccount />
            </SidebarFooter>
        </Sidebar>
    );
}
