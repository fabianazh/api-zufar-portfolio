import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Verifies the JWT token extracted from the request headers.
 * @param req - The request object.
 * @returns A promise that resolves with the decoded token or rejects with an error.
 */

export function verifyToken(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1] ?? ''
    const secret = process.env.NEXTAUTH_SECRET as string
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}
