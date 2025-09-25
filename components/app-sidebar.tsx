"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-client"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


const menuByRole = {
  admin: {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Profil", url: "/dashboard/profil", icon: IconUsers },
      { title: "Manajemen User", url: "/dashboard/users", icon: IconSettings },
      { title: "Data Siswa", url: "/dashboard/students", icon: IconUsers },
      { title: "Data Guru", url: "/dashboard/teachers", icon: IconUsers },
      { title: "Data Kelas", url: "/dashboard/classes", icon: IconFolder },
      { title: "Catatan Konseling", url: "/dashboard/counseling", icon: IconFileDescription },
      { title: "Prestasi Siswa", url: "/dashboard/achievements", icon: IconChartBar },
      { title: "Presensi Harian", url: "/dashboard/attendance", icon: IconListDetails },
    ],
    navSecondary: [
      { title: "Logout", url: "/logout", icon: IconSettings },
    ],
    documents: [],
  },
  guru_bk: {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Profil", url: "/dashboard/profil", icon: IconUsers },
      { title: "Data Siswa", url: "/dashboard/students", icon: IconUsers },
      { title: "Catatan Konseling", url: "/dashboard/counseling", icon: IconFileDescription },
      { title: "Prestasi Siswa", url: "/dashboard/achievements", icon: IconChartBar },
      { title: "Presensi Harian", url: "/dashboard/attendance", icon: IconListDetails },
    ],
    navSecondary: [
      { title: "Logout", url: "/logout", icon: IconSettings },
    ],
    documents: [],
  },
  guru: {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Profil", url: "/dashboard/profil", icon: IconUsers },
      { title: "Data Siswa", url: "/dashboard/students", icon: IconUsers },
      { title: "Prestasi Siswa", url: "/dashboard/achievements", icon: IconChartBar },
      { title: "Presensi Harian", url: "/dashboard/attendance", icon: IconListDetails },
    ],
    navSecondary: [
      { title: "Logout", url: "/logout", icon: IconSettings },
    ],
    documents: [],
  },
  siswa: {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Profil", url: "/dashboard/profil", icon: IconUsers },
      { title: "Biodata", url: "/dashboard/biodata", icon: IconFileWord },
      { title: "Prestasi Siswa", url: "/dashboard/achievements", icon: IconChartBar },
    ],
    navSecondary: [
      { title: "Logout", url: "/logout", icon: IconSettings },
    ],
    documents: [],
  },
  petugas_absen: {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Input Absensi", url: "/dashboard/attendance-input", icon: IconListDetails },
    ],
    navSecondary: [
      { title: "Logout", url: "/logout", icon: IconSettings },
    ],
    documents: [],
  },
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  type Role = keyof typeof menuByRole;
  
  const role: Role = (user?.role as Role) || "admin";
  const menu = menuByRole[role] || menuByRole.admin;

  const userData = user ? {
    name: user.username || "User",
    email: user.username + "@man2ponorogo.sch.id", // Generate email based on username
    avatar: "/codeguide-logo.png",
  } : {
    name: "Guest",
    email: "guest@example.com",
    avatar: "/codeguide-logo.png",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image src="/codeguide-logo.png" alt="MAN 2 Ponorogo" width={32} height={32} className="rounded-lg" />
                <span className="text-base font-semibold font-parkinsans">MAN 2 Ponorogo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu.navMain} />
        {menu.documents.length > 0 && <NavDocuments items={menu.documents} />}
        <NavSecondary items={menu.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
