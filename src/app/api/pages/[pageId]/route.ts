import { getDataById, updateData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/libs/utils/verifyToken'
import { serverTimestamp } from 'firebase/firestore'

export async function GET(
    req: NextRequest,
    { params }: { params: { pageId: string } }
) {
    const { pageId } = params
    try {
        const page = await getDataById<any>('pages', pageId)
        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: page,
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
    { params }: { params: { pageId: string } }
) {
    const data = await req.json()
    const { pageId } = params

    try {
        const decoded = await verifyToken(req)

        await updateData('pages', pageId, {
            ...data.data,
            updated_at: serverTimestamp(),
        })

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Informasi halaman berhasil diperbarui!',
            data: data,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Informasi halaman gagal diperbarui!',
        })
    }
}
