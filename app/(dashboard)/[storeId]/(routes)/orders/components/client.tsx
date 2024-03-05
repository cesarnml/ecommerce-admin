'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { Column, columns } from './columns'

type Props = {
  data: Column[]
}

export const OrderClient = ({ data }: Props) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <Heading title={`Orders (${data.length})`} description="Manage your store orders" />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  )
}
