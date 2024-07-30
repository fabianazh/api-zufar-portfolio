import { getData, addData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import slugify from 'slugify'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(req: NextRequest) {
    const decoded = await verifyToken(req)
    const tools = await getData<Tool>('tools')
    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'success',
        data: tools,
    })
}

export async function POST(req: NextRequest) {
    const data = await req.json()

    try {
        const decoded = await verifyToken(req)

        await addData(
            'tools',
            data.data,
            slugify(data.data.name, { lower: true })
        )

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Perangkat berhasil dibuat!',
            decoded,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Perangkat gagal dibuat!',
            error: error,
        })
    }
}
