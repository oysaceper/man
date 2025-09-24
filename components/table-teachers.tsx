import React from "react"

type Teacher = {
  id: string
  nip: string
  name: string
  subject?: string
}

type Props = {
  data: Teacher[]
}

export function TableTeachers({ data }: Props) {
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">NIP</th>
          <th className="border px-2 py-1">Nama</th>
          <th className="border px-2 py-1">Mapel</th>
        </tr>
      </thead>
      <tbody>
        {data.map((t) => (
          <tr key={t.id}>
            <td className="border px-2 py-1">{t.nip}</td>
            <td className="border px-2 py-1">{t.name}</td>
            <td className="border px-2 py-1">{t.subject || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
