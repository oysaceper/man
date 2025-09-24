"use client";

import { useUser } from "@/lib/user-context";
import { AdminDashboard } from "./admin-dashboard";
import { StudentDashboard } from "./student-dashboard";
import { GuruBKDashboard } from "./guru-bk-dashboard";

export function DashboardRouter() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">Please log in to view the dashboard.</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    
    case 'siswa':
      return <StudentDashboard />;
    
    case 'guru_bk':
      return <GuruBKDashboard />;
    
    case 'guru':
      // For regular teachers, we can show a simplified version of the admin dashboard
      // or create a separate teacher dashboard
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Selamat Datang, Guru</h1>
            <p className="text-blue-100">Dashboard Guru MAN 2 Ponorogo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Data Siswa</h3>
              <p className="text-gray-600">Lihat dan kelola informasi siswa</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Prestasi Siswa</h3>
              <p className="text-gray-600">Input prestasi siswa</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Presensi</h3>
              <p className="text-gray-600">Monitor kehadiran siswa</p>
            </div>
          </div>
        </div>
      );
    
    case 'petugas_absen':
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Dashboard Petugas Absen</h1>
            <p className="text-green-100">Sistem Absensi MAN 2 Ponorogo</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Input Absensi Harian</h3>
            <p className="text-gray-600 mb-4">
              Silakan pilih tanggal dan sesi untuk melakukan input absensi siswa
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <input 
                  type="date" 
                  className="border rounded-md px-3 py-2 w-full"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sesi
                </label>
                <select className="border rounded-md px-3 py-2 w-full">
                  <option value="pagi">Pagi</option>
                  <option value="istirahat_1">Istirahat 1</option>
                  <option value="istirahat_2">Istirahat 2</option>
                </select>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Mulai Input Absensi
              </button>
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Unknown Role</h2>
            <p className="text-gray-600 mt-2">Your user role is not recognized.</p>
          </div>
        </div>
      );
  }
}