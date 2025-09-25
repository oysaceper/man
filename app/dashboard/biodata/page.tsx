"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-client";

interface BiodataForm {
  // Personal info
  asalSekolah: string;
  nik: string;
  kip: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  jumlahSaudara: number;
  anakKe: number;
  hobi: string;
  citaCita: string;
  noHandphone: string;
  alamatEmail: string;
  alamatRumah: string;
  jarakTempuh: string;
  waktuTempuh: string;
  transportasi: string;
  
  // Parent info
  fatherName: string;
  fatherNIK: string;
  fatherPekerjaan: string;
  fatherHandphone: string;
  motherName: string;
  motherNIK: string;
  motherPekerjaan: string;
  motherHandphone: string;
}

export default function BiodataPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BiodataForm>({
    asalSekolah: "",
    nik: "",
    kip: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    jumlahSaudara: 0,
    anakKe: 0,
    hobi: "",
    citaCita: "",
    noHandphone: "",
    alamatEmail: "",
    alamatRumah: "",
    jarakTempuh: "",
    waktuTempuh: "",
    transportasi: "",
    fatherName: "",
    fatherNIK: "",
    fatherPekerjaan: "",
    fatherHandphone: "",
    motherName: "",
    motherNIK: "",
    motherPekerjaan: "",
    motherHandphone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if user is student
  if (user?.role !== "siswa") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Akses ditolak. Halaman ini hanya untuk siswa.</p>
      </div>
    );
  }

  useEffect(() => {
    if (user?.refId) {
      fetchBiodata();
    }
  }, [user]);

  const fetchBiodata = async () => {
    try {
      const response = await fetch(`/api/students/${user?.refId}`);
      if (response.ok) {
        const studentData = await response.json();
        
        // Fetch parent data
        const parentResponse = await fetch(`/api/parents?studentId=${user?.refId}`);
        let parentData = null;
        if (parentResponse.ok) {
          const parents = await parentResponse.json();
          parentData = parents[0];
        }

        setFormData({
          asalSekolah: studentData.asalSekolah || "",
          nik: studentData.nik || "",
          kip: studentData.kip || "",
          tempatLahir: studentData.tempatLahir || "",
          tanggalLahir: studentData.tanggalLahir ? studentData.tanggalLahir.split('T')[0] : "",
          jenisKelamin: studentData.jenisKelamin || "",
          agama: studentData.agama || "",
          jumlahSaudara: studentData.jumlahSaudara || 0,
          anakKe: studentData.anakKe || 0,
          hobi: studentData.hobi || "",
          citaCita: studentData.citaCita || "",
          noHandphone: studentData.noHandphone || "",
          alamatEmail: studentData.alamatEmail || "",
          alamatRumah: studentData.alamatRumah || "",
          jarakTempuh: studentData.jarakTempuh || "",
          waktuTempuh: studentData.waktuTempuh || "",
          transportasi: studentData.transportasi || "",
          fatherName: parentData?.fatherName || "",
          fatherNIK: parentData?.fatherNIK || "",
          fatherPekerjaan: parentData?.fatherPekerjaan || "",
          fatherHandphone: parentData?.fatherHandphone || "",
          motherName: parentData?.motherName || "",
          motherNIK: parentData?.motherNIK || "",
          motherPekerjaan: parentData?.motherPekerjaan || "",
          motherHandphone: parentData?.motherHandphone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching biodata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update student data
      const studentResponse = await fetch(`/api/students/${user?.refId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asalSekolah: formData.asalSekolah,
          nik: formData.nik,
          kip: formData.kip,
          tempatLahir: formData.tempatLahir,
          tanggalLahir: formData.tanggalLahir,
          jenisKelamin: formData.jenisKelamin,
          agama: formData.agama,
          jumlahSaudara: formData.jumlahSaudara,
          anakKe: formData.anakKe,
          hobi: formData.hobi,
          citaCita: formData.citaCita,
          noHandphone: formData.noHandphone,
          alamatEmail: formData.alamatEmail,
          alamatRumah: formData.alamatRumah,
          jarakTempuh: formData.jarakTempuh,
          waktuTempuh: formData.waktuTempuh,
          transportasi: formData.transportasi,
        }),
      });

      // Update parent data
      const parentResponse = await fetch(`/api/parents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user?.refId,
          fatherName: formData.fatherName,
          fatherNIK: formData.fatherNIK,
          fatherPekerjaan: formData.fatherPekerjaan,
          fatherHandphone: formData.fatherHandphone,
          motherName: formData.motherName,
          motherNIK: formData.motherNIK,
          motherPekerjaan: formData.motherPekerjaan,
          motherHandphone: formData.motherHandphone,
        }),
      });

      if (studentResponse.ok) {
        alert("Biodata berhasil disimpan!");
      } else {
        alert("Gagal menyimpan biodata");
      }
    } catch (error) {
      console.error("Error saving biodata:", error);
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p>Memuat biodata...</p>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Biodata Siswa</h1>
          <p className="text-muted-foreground">
            Lengkapi data pribadi dan orang tua Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 lg:px-6 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
              <CardDescription>
                Informasi dasar tentang diri Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="asalSekolah">Asal Sekolah</Label>
                <Input
                  id="asalSekolah"
                  value={formData.asalSekolah}
                  onChange={(e) => setFormData({ ...formData, asalSekolah: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                <Input
                  id="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                <Select value={formData.jenisKelamin} onValueChange={(value) => setFormData({ ...formData, jenisKelamin: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agama">Agama</Label>
                <Input
                  id="agama"
                  value={formData.agama}
                  onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="noHandphone">No. Handphone</Label>
                <Input
                  id="noHandphone"
                  value={formData.noHandphone}
                  onChange={(e) => setFormData({ ...formData, noHandphone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="alamatEmail">Alamat Email</Label>
                <Input
                  id="alamatEmail"
                  type="email"
                  value={formData.alamatEmail}
                  onChange={(e) => setFormData({ ...formData, alamatEmail: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="alamatRumah">Alamat Rumah</Label>
                <Textarea
                  id="alamatRumah"
                  value={formData.alamatRumah}
                  onChange={(e) => setFormData({ ...formData, alamatRumah: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle>Data Orang Tua</CardTitle>
              <CardDescription>
                Informasi ayah dan ibu kandung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Data Ayah</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fatherName">Nama Lengkap Ayah</Label>
                    <Input
                      id="fatherName"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatherNIK">NIK Ayah</Label>
                    <Input
                      id="fatherNIK"
                      value={formData.fatherNIK}
                      onChange={(e) => setFormData({ ...formData, fatherNIK: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatherPekerjaan">Pekerjaan Ayah</Label>
                    <Input
                      id="fatherPekerjaan"
                      value={formData.fatherPekerjaan}
                      onChange={(e) => setFormData({ ...formData, fatherPekerjaan: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatherHandphone">No. HP Ayah</Label>
                    <Input
                      id="fatherHandphone"
                      value={formData.fatherHandphone}
                      onChange={(e) => setFormData({ ...formData, fatherHandphone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Data Ibu</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="motherName">Nama Lengkap Ibu</Label>
                    <Input
                      id="motherName"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherNIK">NIK Ibu</Label>
                    <Input
                      id="motherNIK"
                      value={formData.motherNIK}
                      onChange={(e) => setFormData({ ...formData, motherNIK: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherPekerjaan">Pekerjaan Ibu</Label>
                    <Input
                      id="motherPekerjaan"
                      value={formData.motherPekerjaan}
                      onChange={(e) => setFormData({ ...formData, motherPekerjaan: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherHandphone">No. HP Ibu</Label>
                    <Input
                      id="motherHandphone"
                      value={formData.motherHandphone}
                      onChange={(e) => setFormData({ ...formData, motherHandphone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Biodata"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}