import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}
export default async function SetupLayout({ children }: Props) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  })

  if (store) {
    redirect(`/${store.id}`)
  }

  return <>{children}</>
}
