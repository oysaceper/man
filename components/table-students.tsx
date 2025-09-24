
import React, { useState } from "react"
import { FormStudentEdit } from "@/components/form-student-edit"

type Student = {
  id: string
  nisn: string
  name: string
  classId?: string
}

type Props = {
  data: Student[]
  onEditSuccess?: () => void
}

export function TableStudents({ data, onEditSuccess }: Props) {
  const [editId, setEditId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState("")

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return
    setDeletingId(id)
    setDeleteError("")
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json()
      setDeleteError(data.error || "Gagal menghapus siswa")
    } else {
      onEditSuccess && onEditSuccess()
    }
    setDeletingId(null)
  }

  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">NISN</th>
          <th className="border px-2 py-1">Nama</th>
          <th className="border px-2 py-1">Kelas</th>
          <th className="border px-2 py-1">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <React.Fragment key={s.id}>
            {editId === s.id ? (
              <tr>
                <td colSpan={4} className="border px-2 py-1 bg-gray-50">
                  <FormStudentEdit
                    student={s}
                    onSuccess={() => {
                      setEditId(null)
                      onEditSuccess && onEditSuccess()
                    }}
                    onCancel={() => setEditId(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td className="border px-2 py-1">{s.nisn}</td>
                <td className="border px-2 py-1">{s.name}</td>
                <td className="border px-2 py-1">{s.classId || "-"}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="text-blue-600 underline" onClick={() => setEditId(s.id)}>
                    Edit
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                  >
                    {deletingId === s.id ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        {deleteError && (
          <tr>
            <td colSpan={4} className="text-red-600 text-sm text-center">{deleteError}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
