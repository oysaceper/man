"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCalendarCheck, IconUsers, IconClock } from "@tabler/icons-react";

interface PetugasAbsenStats {
  className: string;
  totalStudents: number;
  todayAttendance: number;
  currentSession: string;
}

export function PetugasAbsenDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PetugasAbsenStats>({
    className: "",
    totalStudents: 0,
    todayAttendance: 0,
    currentSession: "pagi",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch class information for this attendance officer
      const classRes = await fetch(`/api/classes/by-attendance-officer/${user?.refId}`);
      const classData = await classRes.json();

      if (classData) {
        const studentsRes = await fetch(`/api/students?classId=${classData.id}&count=true`);
        const studentsData = await studentsRes.json();

        const attendanceRes = await fetch(`/api/attendance/today?classId=${classData.id}&count=true`);
        const attendanceData = await attendanceRes.json();

        setStats({
          className: classData.name,
          totalStudents: studentsData.count || 0,
          todayAttendance: attendanceData.count || 0,
          currentSession: getCurrentSession(),
        });
      }
    } catch (error) {
      console.error("Error fetching Petugas Absen dashboard stats:", error);
      // Set dummy data for demo
      setStats({
        className: "XII IPA 1",
        totalStudents: 32,
        todayAttendance: 28,
        currentSession: getCurrentSession(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSession = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "pagi";
    if (hour < 14) return "istirahat1";
    return "istirahat2";
  };

  const getSessionName = (session: string) => {
    switch (session) {
      case "pagi": return "Pagi";
      case "istirahat1": return "Istirahat 1";
      case "istirahat2": return "Istirahat 2";
      default: return session;
    }
  };

  const handleInputAbsensi = () => {
    router.push("/dashboard/attendance-input");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Memuat informasi kelas...</p>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Petugas Absen</h1>
          <p className="text-muted-foreground">
            Kelas {stats.className} - Input absensi harian
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
                Siswa di kelas {stats.className}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absen Hari Ini</CardTitle>
              <IconCalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.todayAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Dari {stats.totalStudents} siswa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesi Saat Ini</CardTitle>
              <IconClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getSessionName(stats.currentSession)}</div>
              <p className="text-xs text-muted-foreground">
                Sesi aktif
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Absensi</CardTitle>
              <CardDescription>
                Klik tombol di bawah untuk mulai input absensi kelas {stats.className}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Button 
                  onClick={handleInputAbsensi}
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <IconCalendarCheck className="mr-2 h-5 w-5" />
                  Input Absensi Harian
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Petunjuk Input Absensi</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>1. Pilih tanggal dan sesi (Pagi/Istirahat 1/Istirahat 2)</li>
                    <li>2. Daftar siswa akan muncul otomatis</li>
                    <li>3. Status default adalah "Hadir"</li>
                    <li>4. Ubah status jika ada yang sakit/izin/alpa</li>
                    <li>5. Simpan untuk menyelesaikan input</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Status Kehadiran</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <span className="text-green-600 font-medium">Hadir</span> - Siswa mengikuti pembelajaran</li>
                    <li>• <span className="text-yellow-600 font-medium">Sakit</span> - Siswa sakit dengan keterangan</li>
                    <li>• <span className="text-blue-600 font-medium">Izin</span> - Siswa izin dengan keterangan</li>
                    <li>• <span className="text-red-600 font-medium">Alpa</span> - Siswa tidak hadir tanpa keterangan</li>
                  </ul>
                </div>
              </div>

              {stats.todayAttendance < stats.totalStudents && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Perhatian:</strong> Masih ada {stats.totalStudents - stats.todayAttendance} siswa yang belum diabsen hari ini.
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