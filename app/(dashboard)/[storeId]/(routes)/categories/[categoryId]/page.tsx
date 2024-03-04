import { prisma } from '@/lib/prisma'
import { CategoryForm } from './components/category-form'

type Props = {
  params: {
    categoryId: string
    storeId: string
  }
}

export default async function CategoryPage({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  })

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  )
}
