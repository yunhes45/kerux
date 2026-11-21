import { api } from '@/lib/api'

export type RegisterRequest = {
    email: string,
    username: string,
    realname: string,
    mobile: string,
    password: string
}

export async function register(request: RegisterRequest): Promise<void> {
    await api.post('/api/v1/members', request)
}