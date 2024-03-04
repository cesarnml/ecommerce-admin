import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

type Params = {
  storeId: string
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const response = await prisma.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log('[STORE_DELETE]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()
    const { name } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const store = await prisma.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    })
    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_PATCH]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
