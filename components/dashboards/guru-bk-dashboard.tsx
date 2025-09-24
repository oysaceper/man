"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconNote, IconAlertTriangle, IconUsers, IconClipboardCheck, IconTrendingUp } from "@tabler/icons-react";

interface GuruBKStats {
  totalCounselingNotes: number;
  studentsNeedingFollowup: number;
  classesWithoutAttendance: number;
  monthlyConsultations: number;
}

// Mock data - in real implementation, this would come from API
const mockGuruBKStats: GuruBKStats = {
  totalCounselingNotes: 45,
  studentsNeedingFollowup: 8,
  classesWithoutAttendance: 3,
  monthlyConsultations: 32,
};

const mockRecentCounseling = [
  {
    studentName: "Ahmad Rizki",
    class: "XII IPA 1",
    issue: "Masalah keluarga",
    followUpNeeded: true,
    date: "2024-12-13"
  },
  {
    studentName: "Siti Nurhaliza", 
    class: "XI IPS 2",
    issue: "Kesulitan belajar",
    followUpNeeded: true,
    date: "2024-12-12"
  },
  {
    studentName: "Budi Santoso",
    class: "XI IPA 1", 
    issue: "Konsultasi karir",
    followUpNeeded: false,
    date: "2024-12-11"
  }
];

export function GuruBKDashboard() {
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang, Guru BK</h1>
        <p className="text-purple-100">{currentDate} - {currentTime}</p>
        <p className="text-purple-100">Bimbingan dan Konseling MAN 2 Ponorogo</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catatan Konseling</CardTitle>
            <IconNote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGuruBKStats.totalCounselingNotes}</div>
            <p className="text-xs text-muted-foreground">Total catatan bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Tindak Lanjut</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockGuruBKStats.studentsNeedingFollowup}</div>
            <p className="text-xs text-muted-foreground">Siswa memerlukan perhatian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konsultasi Bulan Ini</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGuruBKStats.monthlyConsultations}</div>
            <p className="text-xs text-muted-foreground">Sesi konseling dilakukan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absensi Hari Ini</CardTitle>
            <IconClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">21</div>
            <p className="text-xs text-muted-foreground">Kelas sudah absen</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Need Follow-up */}
        {mockGuruBKStats.studentsNeedingFollowup > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <IconAlertTriangle className="h-5 w-5" />
                Siswa Perlu Tindak Lanjut
              </CardTitle>
              <CardDescription className="text-orange-700">
                {mockGuruBKStats.studentsNeedingFollowup} siswa memerlukan konseling lanjutan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRecentCounseling
                  .filter(item => item.followUpNeeded)
                  .map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.studentName}</p>
                          <p className="text-sm text-muted-foreground">{item.class} • {item.issue}</p>
                        </div>
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Without Attendance */}
        {mockGuruBKStats.classesWithoutAttendance > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <IconClipboardCheck className="h-5 w-5" />
                Kelas Belum Absen
              </CardTitle>
              <CardDescription className="text-red-700">
                {mockGuruBKStats.classesWithoutAttendance} kelas belum melakukan absensi hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white p-2 rounded border text-sm">XII IPA 1</div>
                <div className="bg-white p-2 rounded border text-sm">XI IPS 2</div>
                <div className="bg-white p-2 rounded border text-sm">X B</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Counseling Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconNote className="h-5 w-5" />
            Aktivitas Konseling Terbaru
          </CardTitle>
          <CardDescription>Catatan konseling siswa dalam 3 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentCounseling.map((counseling, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                counseling.followUpNeeded ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{counseling.studentName}</h4>
                    <p className="text-sm text-muted-foreground">{counseling.class}</p>
                    <p className="text-sm">{counseling.issue}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{counseling.date}</span>
                    {counseling.followUpNeeded && (
                      <div className="mt-1">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          Perlu Tindak Lanjut
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Catatan Konseling</CardTitle>
            <CardDescription>Buat catatan konseling baru</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dokumentasikan sesi konseling dengan siswa dan tindak lanjutnya
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Data Siswa</CardTitle>
            <CardDescription>Lihat informasi siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Akses biodata siswa dan riwayat konseling sebelumnya
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Laporan Konseling</CardTitle>
            <CardDescription>Export laporan bulanan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate laporan kegiatan bimbingan dan konseling
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}