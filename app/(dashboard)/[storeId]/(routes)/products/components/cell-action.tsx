'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Column } from './columns'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertModal } from '@/components/modals/alert-modal'

type Props = {
  data: Column
}

export const CellAction = ({ data }: Props) => {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(data.id)
    toast.success('Product ID copied to the clipboard.')
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await fetch(`/api/${params.storeId}/products/${data.id}`, {
        method: 'DELETE',
      })
      router.refresh()
      toast.success('Product deleted.')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }
  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="mr-2 size-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className="mr-2 size-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
