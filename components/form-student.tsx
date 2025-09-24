"use client"

import { useState } from "react"

type Props = {
  onSuccess?: () => void
}

export function FormStudent({ onSuccess }: Props) {
  const [nisn, setNisn] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nisn, name })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Gagal menambah siswa")
    } else {
      setSuccess("Siswa berhasil ditambah")
      setNisn("")
      setName("")
      onSuccess && onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 max-w-md">
      <label className="font-medium">NISN</label>
      <input value={nisn} onChange={e => setNisn(e.target.value)} className="border px-2 py-1 rounded" required />
      <label className="font-medium">Nama</label>
      <input value={name} onChange={e => setName(e.target.value)} className="border px-2 py-1 rounded" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2" disabled={loading}>
        {loading ? "Menyimpan..." : "Tambah Siswa"}
      </button>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
    </form>
  )
}
