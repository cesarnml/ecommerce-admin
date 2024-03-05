'use client'

import { Button } from '@/components/ui/button'
import { ImagePlusIcon, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
  multiple?: boolean
}

export const ImageUpload = ({ disabled, onChange, onRemove, value, multiple = false }: Props) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative size-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <Trash className="size-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Billboard" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget
        // FIXME: This is a temporary solution to avoid the error
        onUpload={onUpload}
        uploadPreset="ecommerce"
        options={{ sources: ['local'], maxFiles: multiple ? 10 : 1 }}
      >
        {({ open }) => {
          const onClick = () => open()

          return (
            <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
              <ImagePlusIcon className="size-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
