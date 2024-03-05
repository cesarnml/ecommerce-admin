import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { OrderClient } from './components/client'
import { Column } from './components/columns'
import { formatCurrency } from '@/lib/utils'

type Props = {
  params: { storeId: string }
}

export default async function OrdersPage({ params }: Props) {
  const orders = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedData: Column[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatCurrency(
      item.orderItems.reduce((acc, orderItem) => acc + Number(orderItem.product.price), 0),
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <OrderClient data={formattedData} />
        </div>
      </div>
    </>
  )
}
