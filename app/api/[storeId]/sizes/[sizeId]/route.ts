import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

type Params = {
  storeId: string
  sizeId: string
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    if (!params.sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_DELETE]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const size = await prisma.size.delete({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_DELETE]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()
    const { name, value } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 })
    }

    if (!params.sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const size = await prisma.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    })
    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_PATCH]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
