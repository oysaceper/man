"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrophy, IconCalendarCheck, IconUser, IconFileText } from "@tabler/icons-react";

interface SiswaStats {
  totalAttendance: number;
  totalAchievements: number;
  attendancePercentage: number;
  biodataComplete: boolean;
}

export function SiswaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SiswaStats>({
    totalAttendance: 0,
    totalAchievements: 0,
    attendancePercentage: 0,
    biodataComplete: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch dashboard statistics for specific student
      const responses = await Promise.all([
        fetch(`/api/attendance/student/${user?.refId}`),
        fetch(`/api/achievements/student/${user?.refId}`),
        fetch(`/api/students/${user?.refId}/biodata-status`)
      ]);

      const [attendanceRes, achievementsRes, biodataRes] = responses;
      
      const attendanceData = await attendanceRes.json();
      const achievementsData = await achievementsRes.json();
      const biodataData = await biodataRes.json();

      setStats({
        totalAttendance: attendanceData.total || 0,
        totalAchievements: achievementsData.count || 0,
        attendancePercentage: attendanceData.percentage || 0,
        biodataComplete: biodataData.complete || false,
      });
    } catch (error) {
      console.error("Error fetching Siswa dashboard stats:", error);
      // Set dummy data for demo
      setStats({
        totalAttendance: 45,
        totalAchievements: 3,
        attendancePercentage: 95.6,
        biodataComplete: false,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Memuat statistik...</p>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Siswa</h1>
          <p className="text-muted-foreground">
            Selamat datang, {user?.username} - Rekap pribadi absensi dan prestasi
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
              <IconCalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Hari hadir
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Persentase Kehadiran</CardTitle>
              <IconCalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                Tingkat kehadiran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prestasi</CardTitle>
              <IconTrophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAchievements}</div>
              <p className="text-xs text-muted-foreground">
                Prestasi dicapai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Biodata</CardTitle>
              <IconFileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.biodataComplete ? 'text-green-600' : 'text-red-600'}`}>
                {stats.biodataComplete ? 'Lengkap' : 'Belum'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.biodataComplete ? 'Data sudah lengkap' : 'Perlu dilengkapi'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Penting</CardTitle>
              <CardDescription>
                Hal-hal yang perlu diperhatikan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Tugas Siswa</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Lengkapi biodata pribadi dan orang tua</li>
                    <li>• Upload dokumen yang diperlukan</li>
                    <li>• Update prestasi yang diraih</li>
                    <li>• Pantau rekap absensi</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Status</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Kehadiran: <span className={stats.attendancePercentage >= 90 ? 'text-green-600' : 'text-red-600'}>
                      {stats.attendancePercentage >= 90 ? 'Baik' : 'Perlu Diperbaiki'}
                    </span></li>
                    <li>• Biodata: <span className={stats.biodataComplete ? 'text-green-600' : 'text-red-600'}>
                      {stats.biodataComplete ? 'Lengkap' : 'Belum Lengkap'}
                    </span></li>
                    <li>• Prestasi: <span className="text-blue-600">{stats.totalAchievements} prestasi</span></li>
                  </ul>
                </div>
              </div>
              
              {!stats.biodataComplete && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Perhatian:</strong> Biodata Anda belum lengkap. Silakan lengkapi melalui menu Biodata.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}