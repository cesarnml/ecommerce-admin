import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Client } from './components/client'
import { Column } from './components/columns'
import { formatCurrency } from '@/lib/utils'

type Props = {
  params: { storeId: string }
}

export default async function ProductsPage({ params }: Props) {
  const products = await prisma.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: Column[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatCurrency(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Client data={formattedProducts} />
        </div>
      </div>
    </>
  )
}
