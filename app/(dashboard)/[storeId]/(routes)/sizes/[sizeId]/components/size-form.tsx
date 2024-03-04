'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Size } from '@prisma/client'
import { Loader, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>

type Props = {
  initialData: Size | null
}

export const SizeForm = ({ initialData }: Props) => {
  const title = initialData ? 'Edit size' : 'Create size'
  const description = initialData ? 'Edit size' : 'Add new size'
  const toastMessage = initialData ? 'Size updated.' : 'Size created.'
  const action = initialData ? 'Save changes' : 'Create'

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  const onSubmit = async (values: SizeFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        })
      } else {
        await fetch(`/api/${params.storeId}/sizes`, {
          method: 'POST',
          body: JSON.stringify(values),
        })
      }
      router.push(`/${params.storeId}/sizes`)
      router.refresh()
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`, {
        method: 'DELETE',
      })
      router.push(`/${params.storeId}/sizes`)
      router.refresh()
      toast.success('Size deleted.')
    } catch (error) {
      toast.error('Make sure you removed all products for this size first.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size value" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
            {loading && <Loader className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </>
  )
}
