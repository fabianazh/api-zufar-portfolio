import {
    getDataById,
    updateData,
    deleteData,
    deleteFile,
} from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import { serverTimestamp } from 'firebase/firestore'
import { verifyToken } from '@/libs/utils/verifyToken'

export async function GET(
    req: NextRequest,
    { params }: { params: { projectId: string } }
) {
    const { projectId } = params
    try {
        const project = await getDataById<Project>('projects', projectId)
        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'success',
            data: project,
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
    { params }: { params: { projectId: string } }
) {
    const data = await req.json()
    const { projectId } = params

    try {
        const decoded = await verifyToken(req)

        await updateData('projects', projectId, {
            ...data.data,
            updated_at: serverTimestamp(),
        })

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Projek berhasil diperbarui!',
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Projek gagal diperbarui!',
            error,
        })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { projectId: string } }
) {
    const { projectId } = params

    try {
        const decoded = await verifyToken(req)

        const project = await getDataById<Project>('projects', projectId)

        if (project?.thumbnail) {
            await Promise.all(
                project?.thumbnail.map((fileUrl) => deleteFile(fileUrl))
            )
        }

        if (project?.photos) {
            await Promise.all(
                project?.photos.map((fileUrl) => deleteFile(fileUrl))
            )
        }

        await deleteData('projects', projectId)

        return NextResponse.json({
            status: true,
            statusCode: 200,
            message: 'Projek berhasil dihapus!',
        })
    } catch (error) {
        return NextResponse.json({
            status: false,
            statusCode: 500,
            message: 'Projek gagal dihapus!',
            error,
        })
    }
}
