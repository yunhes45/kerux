import { api } from '@/lib/api'

export type LoginResult = {
    accessToken: string
    refreshToken: string | null
}

export async function requestLogin(identifier: string, password: string): Promise<LoginResult> {
    const { data } = await api.post<LoginResult>(
        '/api/v1/auth/login',
        { identifier, password },
        { headers: { 'X-Client-Type': 'native' } },
    )

    return data
}