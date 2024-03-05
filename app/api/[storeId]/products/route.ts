import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

type Params = {
  storeId: string
}

export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } =
      await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
    }

    if (!images || images.length === 0) {
      return new NextResponse('At least 1 image is required', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_POST]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') ?? undefined
    const sizeId = searchParams.get('sizeId') ?? undefined
    const colorId = searchParams.get('colorId') ?? undefined
    const isFeatured = searchParams.get('isFeatured')

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log('[PRODUCTS_GET]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
