"use client"


import { useEffect, useState, useRef } from "react"
import { TableStudents } from "@/components/table-students"
import { FormStudent } from "@/components/form-student"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [classId, setClassId] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function reload() {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.append("q", q)
    if (classId) params.append("classId", classId)
    fetch(`/api/students?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetch("/api/classes").then(res => res.json()).then(setClasses)
  }, [])

  useEffect(() => {
    reload()
    // eslint-disable-next-line
  }, [q, classId])

  function handleExport() {
    window.open("/api/students/export", "_blank")
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    await fetch("/api/students/import", { method: "POST", body: formData })
    reload()
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Siswa</h1>
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <FormStudent onSuccess={reload} />
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-sm font-medium">Kelas</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">Semua</option>
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Cari</label>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nama/NISN" className="border px-2 py-1 rounded" />
          </div>
          <button onClick={handleExport} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
          <label className="bg-blue-600 text-white px-3 py-2 rounded cursor-pointer">
            Import Excel
            <input type="file" accept=".xlsx" ref={fileInputRef} onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
      <TableStudents data={students} onEditSuccess={reload} />
    </div>
  )
}
