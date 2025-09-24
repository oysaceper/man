import { DashboardRouter } from "@/components/dashboards/dashboard-router"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <DashboardRouter />
      </div>
    </div>
  )
}