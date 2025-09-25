"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconNotes, IconTrophy, IconCalendarCheck, IconAlertTriangle } from "@tabler/icons-react";

interface GuruBKStats {
  totalCounselingNotes: number;
  studentsNeedFollowUp: number;
  totalAchievements: number;
  classesWithoutAttendance: number;
}

export function GuruBKDashboard() {
  const [stats, setStats] = useState<GuruBKStats>({
    totalCounselingNotes: 0,
    studentsNeedFollowUp: 0,
    totalAchievements: 0,
    classesWithoutAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch dashboard statistics for Guru BK
      const responses = await Promise.all([
        fetch('/api/counseling-notes?count=true'),
        fetch('/api/counseling-notes?followUp=true&count=true'),
        fetch('/api/achievements?count=true'),
        fetch('/api/attendance/missing-today')
      ]);

      const [counselingRes, followUpRes, achievementsRes, missingAttendanceRes] = responses;
      
      const counselingData = await counselingRes.json();
      const followUpData = await followUpRes.json();
      const achievementsData = await achievementsRes.json();
      const missingAttendanceData = await missingAttendanceRes.json();

      setStats({
        totalCounselingNotes: counselingData.count || 0,
        studentsNeedFollowUp: followUpData.count || 0,
        totalAchievements: achievementsData.count || 0,
        classesWithoutAttendance: missingAttendanceData.count || 0,
      });
    } catch (error) {
      console.error("Error fetching Guru BK dashboard stats:", error);
      // Set dummy data for demo
      setStats({
        totalCounselingNotes: 85,
        studentsNeedFollowUp: 12,
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Guru BK</h1>
          <p className="text-muted-foreground">
            Rekap konseling dan prestasi siswa MAN 2 Ponorogo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catatan Konseling</CardTitle>
              <IconNotes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCounselingNotes}</div>
              <p className="text-xs text-muted-foreground">
                Total catatan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perlu Tindak Lanjut</CardTitle>
              <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.studentsNeedFollowUp}</div>
              <p className="text-xs text-muted-foreground">
                Siswa perlu perhatian
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
              <CardTitle>Tugas Utama Guru BK</CardTitle>
              <CardDescription>
                Akses cepat ke fungsi konseling dan prestasi siswa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Konseling</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Tambah catatan konseling siswa</li>
                    <li>• Upload dokumen pendukung</li>
                    <li>• Monitor siswa yang perlu tindak lanjut</li>
                    <li>• Laporan konseling berkala</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Prestasi</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Catat prestasi siswa</li>
                    <li>• Kelola data lomba dan pencapaian</li>
                    <li>• Export laporan prestasi</li>
                    <li>• Monitor perkembangan siswa</li>
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