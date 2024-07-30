import { getData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(req: NextRequest) {
    try {
        const decoded = await verifyToken(req)
        const pages = await getData<any>('pages')
        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: pages,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Terjadi kesalahan.',
        })
    }
}

export async function POST(req: NextRequest) {
    return NextResponse.json(
        {
            status: false,
            statusCode: 405,
            message: 'Method Not Allowed',
        },
        { status: 405 }
    )
}
