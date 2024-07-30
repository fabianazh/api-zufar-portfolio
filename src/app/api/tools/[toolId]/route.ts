import { deleteData, getDataById, updateData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(
    req: NextRequest,
    { params }: { params: { toolId: string } }
) {
    const { toolId } = params
    try {
        const tools = await getDataById<Tool>('tools', toolId)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: tools,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Terjadi kesalahan.',
        })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { toolId: string } }
) {
    const data = await req.json()
    const { toolId } = params

    try {
        const decoded = await verifyToken(req)

        await updateData('tools', toolId, data.data)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Perangkat berhasil diperbarui!',
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Perangkat gagal diperbarui!',
        })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { toolId: string } }
) {
    const { toolId } = params

    try {
        const decoded = await verifyToken(req)

        await deleteData('tools', toolId)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Perangkat berhasil dihapus!',
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Perangkat gagal dihapus!',
        })
    }
}
