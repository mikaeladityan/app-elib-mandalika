import {
    Home,
    Users,
    Settings,
    HelpCircle,
    Search,
    Building2,
    PencilRuler,
    BookHeart,
    LibraryBig,
    Share,
    Rss,
    MessageCircle,
} from "lucide-react";

export type SidebarItem = {
    title: string;
    url?: string;
    icon: any;
    badge?: number;
};

export type SidebarSection = {
    label: string;
    collapsible?: boolean;
    key?: string;
    icon?: any;
    items: SidebarItem[];
};

export const sidebarConfig: SidebarSection[] = [
    {
        label: "Utama",
        items: [{ title: "Dashboard", url: "/", icon: Home }],
    },

    {
        label: "Komunitas",
        collapsible: true,
        key: "community",
        icon: Rss,
        items: [
            { title: "Status Publik", url: "/posts", icon: Rss },
            { title: "Komentar", url: "/comments", icon: MessageCircle },
        ],
    },

    {
        label: "Perpustakaan",
        collapsible: true,
        key: "libraries",
        icon: LibraryBig,
        items: [
            { title: "Buku", url: "/books", icon: BookHeart },
            { title: "Penulis", url: "/authors", icon: PencilRuler },
            // { title: "Penerbit", url: "/settings/users", icon: Share },
        ],
    },

    // {
    //     label: "Pengaturan",
    //     collapsible: true,
    //     key: "settings",
    //     icon: Settings,
    //     items: [
    //         { title: "Perusahaan", url: "/companies", icon: Building2 },
    //         { title: "Pengguna", url: "/settings/users", icon: Users },
    //     ],
    // },
    {
        label: "Dukungan",
        items: [
            { title: "Bantuan & Dukungan", url: "/help", icon: HelpCircle },
            { title: "Cari", url: "/search", icon: Search },
        ],
    },
];
