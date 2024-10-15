import { NextRequest, NextResponse } from 'next/server'

type ProductData = {
  title: string
  description: string
  priceUnit: string
  productCollectionID: string
  shippingType: string
  media: Array<{ url: string; isMain: boolean }>
  sku: Array<{
    price: number
    quantity: number
    weight: number
    height: number
    length: number
    width: number
    externalId: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const productData: ProductData = await request.json()

    // Log the received data
    console.log('Received product data:', productData)

    // Validate required fields
    if (!productData.title || !productData.description || !productData.productCollectionID) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Validate SKU data
    if (!productData.sku || productData.sku.length === 0) {
      return NextResponse.json({ message: 'At least one SKU is required' }, { status: 400 })
    }

    for (const sku of productData.sku) {
      if (sku.price <= 0 || sku.quantity < 0 || sku.weight <= 0 || sku.height <= 0 || sku.length <= 0 || sku.width <= 0) {
        return NextResponse.json({ message: 'Invalid SKU data' }, { status: 400 })
      }
    }

    // Here you would typically save the data to a database
    // For this example, we'll just simulate a successful creation
    const createdProduct = {
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      ...productData,
      createdAt: new Date().toISOString()
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      message: 'Product created successfully',
      product: createdProduct
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}