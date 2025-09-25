"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth-client";

interface Student {
  id: string;
  nisn: string;
  name: string;
}

interface AttendanceRecord {
  studentId: string;
  status: string;
}

export default function AttendanceInputPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState("pagi");
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if user is attendance officer
  if (user?.role !== "petugas_absen") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Akses ditolak. Halaman ini hanya untuk petugas absen.</p>
      </div>
    );
  }

  useEffect(() => {
    if (user?.refId) {
      fetchClassAndStudents();
    }
  }, [user]);

  const fetchClassAndStudents = async () => {
    try {
      // Fetch class information where this student is attendance officer
      const classResponse = await fetch(`/api/classes/by-attendance-officer/${user?.refId}`);
      if (classResponse.ok) {
        const classData = await classResponse.json();
        setClassInfo(classData);

        // Fetch students in this class
        const studentsResponse = await fetch(`/api/students?classId=${classData.id}`);
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          setStudents(studentsData);

          // Initialize attendance with "hadir" as default
          const initialAttendance: Record<string, string> = {};
          studentsData.forEach((student: Student) => {
            initialAttendance[student.id] = "hadir";
          });
          setAttendance(initialAttendance);
        }
      }
    } catch (error) {
      console.error("Error fetching class and students:", error);
      // For demo, set some dummy data
      const dummyStudents = [
        { id: "1", nisn: "0012345678", name: "Ahmad Fauzi" },
        { id: "2", nisn: "0012345679", name: "Siti Aisyah" },
        { id: "3", nisn: "0012345680", name: "Muhammad Rizki" },
      ];
      setStudents(dummyStudents);
      setClassInfo({ id: "1", name: "XII IPA 1" });
      
      const initialAttendance: Record<string, string> = {};
      dummyStudents.forEach((student) => {
        initialAttendance[student.id] = "hadir";
      });
      setAttendance(initialAttendance);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    
    try {
      // Prepare attendance records
      const attendanceRecords = students.map(student => ({
        id: crypto.randomUUID(),
        classId: classInfo.id,
        studentId: student.id,
        date: new Date(selectedDate),
        session: selectedSession,
        status: attendance[student.id] || "hadir",
      }));

      // Submit attendance
      const response = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: attendanceRecords }),
      });

      if (response.ok) {
        alert("Absensi berhasil disimpan!");
      } else {
        alert("Gagal menyimpan absensi");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hadir": return "text-green-600";
      case "sakit": return "text-yellow-600";
      case "izin": return "text-blue-600";
      case "alpa": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Memuat data kelas...</p>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Input Absensi</h1>
          <p className="text-muted-foreground">
            Kelas {classInfo?.name} - Input kehadiran siswa
          </p>
        </div>

        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Absensi Harian</CardTitle>
              <CardDescription>
                Pilih tanggal dan sesi, lalu atur status kehadiran setiap siswa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Session Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="session">Sesi</Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sesi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagi">Pagi</SelectItem>
                      <SelectItem value="istirahat1">Istirahat 1</SelectItem>
                      <SelectItem value="istirahat2">Istirahat 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>NISN</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Status Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{student.nisn}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Select
                            value={attendance[student.id] || "hadir"}
                            onValueChange={(value) => handleStatusChange(student.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hadir">
                                <span className="text-green-600">Hadir</span>
                              </SelectItem>
                              <SelectItem value="sakit">
                                <span className="text-yellow-600">Sakit</span>
                              </SelectItem>
                              <SelectItem value="izin">
                                <span className="text-blue-600">Izin</span>
                              </SelectItem>
                              <SelectItem value="alpa">
                                <span className="text-red-600">Alpa</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {students.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada siswa ditemukan di kelas ini
                </div>
              )}

              {/* Summary */}
              {students.length > 0 && (
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(attendance).filter(status => status === "hadir").length}
                    </div>
                    <div className="text-sm text-green-600">Hadir</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Object.values(attendance).filter(status => status === "sakit").length}
                    </div>
                    <div className="text-sm text-yellow-600">Sakit</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(attendance).filter(status => status === "izin").length}
                    </div>
                    <div className="text-sm text-blue-600">Izin</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.values(attendance).filter(status => status === "alpa").length}
                    </div>
                    <div className="text-sm text-red-600">Alpa</div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={saving || students.length === 0}
                  size="lg"
                >
                  {saving ? "Menyimpan..." : "Simpan Absensi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}