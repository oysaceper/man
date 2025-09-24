"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconSchool, IconBook, IconClipboardCheck, IconAlertTriangle } from "@tabler/icons-react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  classesWithoutAttendance: number;
}

// Mock data - in real implementation, this would come from API
const mockStats: DashboardStats = {
  totalStudents: 847,
  totalTeachers: 42,
  totalClasses: 24,
  classesWithoutAttendance: 3,
};

export function AdminDashboard() {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang, Administrator</h1>
        <p className="text-blue-100">{currentDate} - {currentTime}</p>
        <p className="text-blue-100">Sistem Informasi MAN 2 Ponorogo</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalStudents.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Siswa aktif tahun ajaran ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Guru dan tenaga pendidik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Kelas aktif (X, XI, XII)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absensi Hari Ini</CardTitle>
            <IconClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.totalClasses - mockStats.classesWithoutAttendance}</div>
            <p className="text-xs text-muted-foreground">Kelas sudah absen</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Attendance Alert */}
      {mockStats.classesWithoutAttendance > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <IconAlertTriangle className="h-5 w-5" />
              Perhatian: Kelas Belum Absen
            </CardTitle>
            <CardDescription className="text-orange-700">
              Masih ada {mockStats.classesWithoutAttendance} kelas yang belum melakukan absensi pada sesi saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Kelas yang belum absen:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border text-sm">XII IPA 1</div>
                <div className="bg-white p-2 rounded border text-sm">XI IPS 2</div>
                <div className="bg-white p-2 rounded border text-sm">X B</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Manajemen User</CardTitle>
            <CardDescription>Kelola akun pengguna sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tambah, edit, atau hapus akun admin, guru, dan siswa
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Data Siswa</CardTitle>
            <CardDescription>Kelola informasi siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Import data, kelola biodata, dan administrasi siswa
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Presensi Harian</CardTitle>
            <CardDescription>Monitor kehadiran siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lihat rekap absensi dan export laporan kehadiran
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}