import { getDataById, updateData, deleteData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(
    req: NextRequest,
    { params }: { params: { mailId: string } }
) {
    const { mailId } = params
    try {
        const mail = await getDataById<Mail>('mails', mailId)

        if (mail?.isUnread) {
            const decoded = await verifyToken(req)
            await updateData('mails', mailId, {
                isUnread: false,
            })
        }

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: mail,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Terjadi kesalahan.',
        })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { mailId: string } }
) {
    const { mailId } = params

    try {
        const decoded = await verifyToken(req)

        await deleteData('mails', mailId)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Pesan berhasil dihapus!',
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Pesan gagal dihapus!',
        })
    }
}
