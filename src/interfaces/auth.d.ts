// /types/next-auth.d.ts
import { DefaultUser, DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        accessToken?: string
        user?: {
            id?: string
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        id?: string
        password: string
        email: string
        username: string
        fullname: string
        phone: string
    }
}
