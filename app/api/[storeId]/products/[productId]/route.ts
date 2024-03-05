import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

type Params = {
  storeId: string
  productId: string
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    if (!params.productId) {
      return new NextResponse('Product ID is required', { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_GET]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.productId) {
      return new NextResponse('Product ID is required', { status: 400 })
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

    const product = await prisma.product.delete({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_DELETE]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
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

    if (!params.productId) {
      return new NextResponse('Product ID is required', { status: 400 })
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

    await prisma.product.update({
      where: {
        id: params.productId,
      },
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
          deleteMany: {},
        },
      },
    })

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_PATCH]:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
