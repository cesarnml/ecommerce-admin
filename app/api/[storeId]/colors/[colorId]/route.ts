import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

type Params = {
  storeId: string
  colorId: string
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
    }

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_GET]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
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

    const color = await prisma.color.delete({
      where: {
        id: params.colorId,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_DELETE]:', error)
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

    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
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

    const color = await prisma.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    })
    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_PATCH]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
