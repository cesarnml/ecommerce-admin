import { SettingsForm } from '@/app/(dashboard)/[storeId]/(routes)/settings/components/settings-form'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

type Props = {
  params: {
    storeId: string
  }
}

export default async function SettingsPage({ params }: Props) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
