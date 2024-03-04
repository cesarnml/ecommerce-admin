import { prisma } from '@/lib/prisma'

type Props = {
  params: { storeId: string }
}

export default async function DashboardPage({ params }: Props) {
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
    },
  })

  if (!store) return null

  return <div>Active Store: {store.name}</div>
}
