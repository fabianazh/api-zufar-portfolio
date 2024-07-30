import { getData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const contacts = await getData<Contact>('contacts')
    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'success',
        data: contacts,
    })
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
