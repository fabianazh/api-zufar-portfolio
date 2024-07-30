import { deleteData, getDataById, updateData } from '@/libs/firebase/service'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(
    req: NextRequest,
    { params }: { params: { toolId: string } }
) {
    const toolId = params.toolId
    const tools = await getDataById<Tool>('tools', toolId)

    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'success',
        data: tools,
    })
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { toolId: string } }
) {
    const data = await req.json()
    const toolId = params.toolId
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
    const toolId = params.toolId
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
