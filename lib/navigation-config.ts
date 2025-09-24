import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconLogout,
  IconNote,
  IconReport,
  IconSettings,
  IconTrophy,
  IconUser,
  IconUsers,
  IconSchool,
  IconClipboardCheck,
  IconBook,
  IconId,
} from "@tabler/icons-react";

export interface NavItem {
  title: string;
  url: string;
  icon: any;
  items?: NavItem[];
}

// Admin Navigation
export const adminNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Profil",
    url: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Manajemen User",
    url: "/dashboard/users",
    icon: IconUsers,
  },
  {
    title: "Data Siswa",
    url: "/dashboard/students",
    icon: IconId,
  },
  {
    title: "Data Guru",
    url: "/dashboard/teachers",
    icon: IconSchool,
  },
  {
    title: "Data Kelas",
    url: "/dashboard/classes",
    icon: IconBook,
  },
  {
    title: "Catatan Konseling",
    url: "/dashboard/counseling",
    icon: IconNote,
  },
  {
    title: "Prestasi Siswa",
    url: "/dashboard/achievements",
    icon: IconTrophy,
  },
  {
    title: "Presensi Harian",
    url: "/dashboard/attendance",
    icon: IconClipboardCheck,
  },
];

// Guru BK Navigation
export const guruBkNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Profil",
    url: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Data Siswa",
    url: "/dashboard/students",
    icon: IconId,
  },
  {
    title: "Catatan Konseling",
    url: "/dashboard/counseling",
    icon: IconNote,
  },
  {
    title: "Prestasi Siswa",
    url: "/dashboard/achievements",
    icon: IconTrophy,
  },
  {
    title: "Presensi Harian",
    url: "/dashboard/attendance",
    icon: IconClipboardCheck,
  },
];

// Guru Navigation
export const guruNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Profil",
    url: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Data Siswa",
    url: "/dashboard/students",
    icon: IconId,
  },
  {
    title: "Prestasi Siswa",
    url: "/dashboard/achievements",
    icon: IconTrophy,
  },
  {
    title: "Presensi Harian",
    url: "/dashboard/attendance",
    icon: IconClipboardCheck,
  },
];

// Siswa Navigation
export const siswaNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Profil",
    url: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Biodata",
    url: "/dashboard/biodata",
    icon: IconFileDescription,
  },
  {
    title: "Prestasi Siswa",
    url: "/dashboard/achievements",
    icon: IconTrophy,
  },
];

// Petugas Absen Navigation
export const petugasAbsenNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
];

// Common secondary navigation
export const commonSecondaryNav: NavItem[] = [
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: IconSettings,
  },
];

// Function to get navigation based on role
export function getNavigationByRole(role: string): NavItem[] {
  switch (role) {
    case 'admin':
      return adminNavigation;
    case 'guru_bk':
      return guruBkNavigation;
    case 'guru':
      return guruNavigation;
    case 'siswa':
      return siswaNavigation;
    case 'petugas_absen':
      return petugasAbsenNavigation;
    default:
      return [];
  }
}