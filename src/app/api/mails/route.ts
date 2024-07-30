import { NextRequest, NextResponse } from 'next/server'
import { addData, getData } from '@/libs/firebase/service'
import { serverTimestamp } from 'firebase/firestore'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(req: NextRequest) {
    try {
        const decoded = await verifyToken(req)
        const mails = await getData<Mail>('mails')
        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: mails,
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
    try {
        const data = await req.json()
        await addData('mails', {
            name: data.data.name,
            email: data.data.email,
            message: data.data.message,
            created_at: serverTimestamp(),
            isUnread: true,
        })

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Pesan berhasil dikirim!',
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Pesan gagal dikirim!',
        })
    }
}
