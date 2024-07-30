import axios from 'axios'
import { getSession } from 'next-auth/react'

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Expires: 0,
}

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers,
    timeout: 60 * 1000,
})

instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

instance.interceptors.request.use(
    async (config) => {
        const session = await getSession()
        if (session) {
            config.headers.Authorization = `Bearer ${session.accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default instance
