import { MainNav } from '@/components/main-nav'
import { prisma } from '@/lib/prisma'
import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { StoreSwitcher } from './store-switcher'
import { ThemeToggle } from './theme-toggle'

export const Navbar = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  })
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  )
}
