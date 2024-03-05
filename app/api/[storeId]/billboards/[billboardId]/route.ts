import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

type Params = {
  storeId: string
  billboardId: string
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 })
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_GET]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 })
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

    const billboard = await prisma.billboard.delete({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_DELETE]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()
    const { label, imageUrl } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 })
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 })
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

    const billboard = await prisma.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    })
    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_PATCH]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
