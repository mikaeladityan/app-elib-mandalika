import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SidebarSection } from "./sidebar.config";
import Link from "next/link";

export function SidebarSectionRenderer({
    section,
    open,
    onToggle,
}: {
    section: SidebarSection;
    open?: boolean;
    onToggle?: () => void;
}) {
    const Icon = section.icon;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>

            {section.collapsible ? (
                <Collapsible open={open} onOpenChange={onToggle}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                {Icon && <Icon className="h-4 w-4" />}
                                <span>{section.label}</span>
                                {open ? (
                                    <ChevronUp className="ml-auto h-4 w-4" />
                                ) : (
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                )}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </SidebarMenuItem>

                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {section.items.map((item) => (
                                <SidebarMenuSubItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`${item.url}`}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <span className="ml-auto rounded-full bg-blue-500 px-2 text-xs text-white">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            ) : (
                <SidebarMenu>
                    {section.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={`${item.url}`}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            )}
        </SidebarGroup>
    );
}
