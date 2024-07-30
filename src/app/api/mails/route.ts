import { NextRequest, NextResponse } from 'next/server'
import { addData, getData } from '@/libs/firebase/service'
import { serverTimestamp } from 'firebase/firestore'

export async function GET(req: NextRequest) {
    const mails = await getData<Mail>('mails')
    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'success',
        data: mails,
    })
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
