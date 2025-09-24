"use client"

import { useEffect, useState } from "react"
import { TableTeachers } from "@/components/table-teachers"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/teachers")
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Guru</h1>
      <TableTeachers data={teachers} />
    </div>
  )
}
