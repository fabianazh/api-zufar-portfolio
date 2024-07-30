// /libs/auth-options.ts
import { signIn, signInWithGoogle } from '@/libs/firebase/service'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { AuthOptions } from 'next-auth'
import jwt from 'jsonwebtoken'

const allowedEmails = ['zufarali321@gmail.com', 'fabianazhar726@gmail.com']

export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'text',
                },
                password: {
                    label: 'password',
                    type: 'password',
                },
            },
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }

                const user: any = await signIn(email)

                if (user) {
                    const passwordConfirm = await bcrypt.compare(
                        password,
                        user.password
                    )
                    if (passwordConfirm) {
                        return user
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                if (allowedEmails.includes(user.email)) {
                    return true
                } else {
                    return false
                }
            }
            return true
        },
        async jwt({ token, profile, account, user }) {
            if (account?.provider === 'credentials') {
                token.user = user
                token.email = user.email
                token.phone = user.phone
                token.fullname = user.fullname
                token.username = user.username
            }

            if (account?.provider === 'google') {
                const data = {
                    email: user.email,
                    phone: user.phone,
                    fullname: user.fullname,
                    username: user.username,
                    type: 'google',
                }

                await signInWithGoogle(data, (data: any) => {
                    token.email = data.email
                    token.fullname = data.fullname
                })
            }

            return token
        },
        async session({ session, token }: any) {
            if ('email' in token) {
                session.user.email = token.email
            }
            if ('phone' in token) {
                session.user.phone = token.phone
            }
            if ('fullname' in token) {
                session.user.fullname = token.fullname
            }
            if ('username' in token) {
                session.user.username = token.username
            }

            const accessToken = jwt.sign(
                token,
                process.env.NEXTAUTH_SECRET ?? '',
                {
                    algorithm: 'HS256',
                }
            )

            session.accessToken = accessToken

            return session
        },
    },
    pages: {
        signIn: '/auth/sambalado',
    },
}
