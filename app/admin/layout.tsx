import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { requireAdminOrStaff } from "@/lib/auth-utils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminOrStaff()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
