"use client"

import { useState } from "react"

type Props = {
  student: { id: string; nisn: string; name: string }
  onSuccess?: () => void
  onCancel?: () => void
}

export function FormStudentEdit({ student, onSuccess, onCancel }: Props) {
  const [nisn, setNisn] = useState(student.nisn)
  const [name, setName] = useState(student.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    const res = await fetch(`/api/students/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nisn, name })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Gagal mengedit siswa")
    } else {
      setSuccess("Siswa berhasil diedit")
      onSuccess && onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 max-w-md bg-gray-50 p-4 rounded border">
      <label className="font-medium">NISN</label>
      <input value={nisn} onChange={e => setNisn(e.target.value)} className="border px-2 py-1 rounded" required />
      <label className="font-medium">Nama</label>
      <input value={name} onChange={e => setName(e.target.value)} className="border px-2 py-1 rounded" required />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        {onCancel && (
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel} disabled={loading}>
            Batal
          </button>
        )}
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
    </form>
  )
}
