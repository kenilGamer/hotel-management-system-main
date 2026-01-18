import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getSettings } from "@/app/actions/settings"
import { SettingsForm } from "@/app/admin/settings/components/settings-form"
import { requireAdmin } from "@/lib/auth-utils"

export const metadata = {
  title: "Settings | Hotel Management",
  description: "System settings",
}

async function SettingsContent() {
  await requireAdmin()
  const settings = await getSettings()

  return <SettingsForm settings={settings} />
}

function SettingsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system settings</p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
