"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCalendarCheck, IconTrophy, IconUser, IconFileDescription, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";

interface StudentStats {
  attendancePercentage: number;
  totalAchievements: number;
  profileComplete: boolean;
  documentsComplete: boolean;
}

// Mock data - in real implementation, this would come from API based on logged-in student
const mockStudentStats: StudentStats = {
  attendancePercentage: 92.5,
  totalAchievements: 3,
  profileComplete: true,
  documentsComplete: false,
};

const mockAchievements = [
  {
    year: "2024",
    competition: "Olimpiade Matematika Tingkat Kabupaten",
    organizer: "Dinas Pendidikan Ponorogo",
    level: "Kabupaten",
    field: "Matematika",
    achievement: "Juara 2"
  },
  {
    year: "2024", 
    competition: "Lomba Karya Tulis Ilmiah",
    organizer: "SMAN 1 Ponorogo",
    level: "Sekolah",
    field: "Sains",
    achievement: "Juara 1"
  },
  {
    year: "2023",
    competition: "Festival Seni Budaya",
    organizer: "Pemerintah Kabupaten Ponorogo",
    level: "Kabupaten", 
    field: "Seni",
    achievement: "Juara 3"
  }
];

export function StudentDashboard() {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return "Sangat Baik";
    if (percentage >= 75) return "Baik";
    return "Perlu Perbaikan";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang, Budi Santoso</h1>
        <p className="text-green-100">{currentDate}</p>
        <p className="text-green-100">NISN: 1234567890 • Kelas: XI IPA 1</p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
            <IconCalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(mockStudentStats.attendancePercentage)}`}>
              {mockStudentStats.attendancePercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {getAttendanceStatus(mockStudentStats.attendancePercentage)}
            </p>
            <Progress value={mockStudentStats.attendancePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestasi</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudentStats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">Total prestasi yang dicapai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profil</CardTitle>
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {mockStudentStats.profileComplete ? (
                <IconCircleCheck className="h-5 w-5 text-green-600" />
              ) : (
                <IconCircleX className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {mockStudentStats.profileComplete ? "Lengkap" : "Belum Lengkap"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Status biodata siswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen</CardTitle>
            <IconFileDescription className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {mockStudentStats.documentsComplete ? (
                <IconCircleCheck className="h-5 w-5 text-green-600" />
              ) : (
                <IconCircleX className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {mockStudentStats.documentsComplete ? "Lengkap" : "Belum Lengkap"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Status dokumen pendukung</p>
          </CardContent>
        </Card>
      </div>

      {/* Document Alert */}
      {!mockStudentStats.documentsComplete && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <IconCircleX className="h-5 w-5" />
              Dokumen Belum Lengkap
            </CardTitle>
            <CardDescription className="text-red-700">
              Mohon lengkapi dokumen pendukung untuk administrasi sekolah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">Dokumen yang masih diperlukan:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Akte Kelahiran</li>
                <li>• Kartu Keluarga Terbaru</li>
                <li>• Ijazah SMP/MTs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5" />
            Prestasi Terbaru
          </CardTitle>
          <CardDescription>Daftar prestasi yang telah dicapai</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAchievements.map((achievement, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{achievement.competition}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.organizer}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Tahun: {achievement.year}</span>
                      <span>Tingkat: {achievement.level}</span>
                      <span>Bidang: {achievement.field}</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                    {achievement.achievement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Lengkapi Biodata</CardTitle>
            <CardDescription>Update informasi pribadi dan keluarga</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pastikan data pribadi dan informasi orang tua sudah lengkap dan akurat
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Prestasi</CardTitle>
            <CardDescription>Input prestasi baru yang dicapai</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Catat prestasi akademik maupun non-akademik untuk portofolio
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}