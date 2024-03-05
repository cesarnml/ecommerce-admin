import { prisma } from '@/lib/prisma'
import { ColorForm } from './components/color-form'

type Props = {
  params: {
    colorId: string
  }
}

export default async function ColorPage({ params }: Props) {
  const color = await prisma.color.findUnique({
    where: {
      id: params.colorId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}
