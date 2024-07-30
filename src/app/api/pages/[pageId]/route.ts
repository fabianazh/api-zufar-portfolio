import { getDataById, updateData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(
    req: NextRequest,
    { params }: { params: { pageId: string } }
) {
    const pageId = params.pageId
    const page = await getDataById<any>('pages', pageId)
    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'success',
        data: page,
    })
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { pageId: string } }
) {
    const data = await req.json()
    const pageId = params.pageId
    const token = req.headers.get('Authorization')?.split(' ')[1] ?? ''

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(
                token,
                process.env.NEXTAUTH_SECRET as string,
                (err, decoded) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(decoded)
                    }
                }
            )
        })

        await updateData('pages', pageId, data.data)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Update halaman berhasil!',
            data: data,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Update halaman gagal!',
        })
    }
}
