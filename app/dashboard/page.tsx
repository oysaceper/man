"use client";

import { useAuth } from "@/lib/auth-client";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { GuruBKDashboard } from "@/components/dashboards/guru-bk-dashboard";
import { GuruDashboard } from "@/components/dashboards/guru-dashboard";
import { SiswaDashboard } from "@/components/dashboards/siswa-dashboard";
import { PetugasAbsenDashboard } from "@/components/dashboards/petugas-absen-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Loading...</p>
      </div>
    );
  }

  // Render role-specific dashboard
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "guru_bk":
      return <GuruBKDashboard />;
    case "guru":
      return <GuruDashboard />;
    case "siswa":
      return <SiswaDashboard />;
    case "petugas_absen":
      return <PetugasAbsenDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-96">
          <p>Role tidak dikenali: {user.role}</p>
        </div>
      );
  }
}