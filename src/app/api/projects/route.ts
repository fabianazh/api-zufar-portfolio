import { getData, addData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import slugify from 'slugify'
import { serverTimestamp } from 'firebase/firestore'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(req: NextRequest) {
    try {
        const projects = await getData<Project>('projects')
        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: projects,
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
    const data = await req.json()

    const projectId = slugify(data.data.name, { lower: true })

    try {
        const decoded = await verifyToken(req)
 

        await addData('projects', {
            ...data.data,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        }, projectId)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Projek berhasil dibuat!',
            projectId,
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Projek gagal dibuat!',
            error: error,
        })
    }
}
