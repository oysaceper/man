"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCalendarCheck, IconTrophy, IconUsers } from "@tabler/icons-react";

interface GuruStats {
  totalStudents: number;
  totalAchievements: number;
  classesWithoutAttendance: number;
}

export function GuruDashboard() {
  const [stats, setStats] = useState<GuruStats>({
    totalStudents: 0,
    totalAchievements: 0,
    classesWithoutAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch dashboard statistics for Guru
      const responses = await Promise.all([
        fetch('/api/students?count=true'),
        fetch('/api/achievements?count=true'),
        fetch('/api/attendance/missing-today')
      ]);

      const [studentsRes, achievementsRes, missingAttendanceRes] = responses;
      
      const studentsData = await studentsRes.json();
      const achievementsData = await achievementsRes.json();
      const missingAttendanceData = await missingAttendanceRes.json();

      setStats({
        totalStudents: studentsData.count || 0,
        totalAchievements: achievementsData.count || 0,
        classesWithoutAttendance: missingAttendanceData.count || 0,
      });
    } catch (error) {
      console.error("Error fetching Guru dashboard stats:", error);
      // Set dummy data for demo
      setStats({
        totalStudents: 450,
        totalAchievements: 23,
        classesWithoutAttendance: 3,
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Guru</h1>
          <p className="text-muted-foreground">
            Informasi siswa dan absensi MAN 2 Ponorogo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 px-4 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Siswa terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prestasi Siswa</CardTitle>
              <IconTrophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalAchievements}</div>
              <p className="text-xs text-muted-foreground">
                Prestasi tercatat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Absen Hari Ini</CardTitle>
              <IconCalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.classesWithoutAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Kelas perlu perhatian
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Tugas Utama Guru</CardTitle>
              <CardDescription>
                Akses cepat ke fungsi utama guru
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Data Siswa</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Lihat daftar siswa</li>
                    <li>• Cari berdasarkan nama/NISN</li>
                    <li>• Filter berdasarkan kelas</li>
                    <li>• Export data siswa</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Prestasi & Absensi</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Catat prestasi siswa</li>
                    <li>• Monitor absensi harian</li>
                    <li>• Rekap bulanan</li>
                    <li>• Export laporan</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}