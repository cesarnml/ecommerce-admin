'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Column, columns } from './columns'
import { ApiList } from '@/components/ui/api-list'

type Props = {
  data: Column[]
}

export const Client = ({ data }: Props) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Products (${data.length})`} description="Manage your store products" />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  )
}
