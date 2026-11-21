import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE ?? ''

let memberId: number | null = null
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
    accessToken = token
}

export function setMemberId(id: number | null) {
    memberId = id
}

export const api = axios.create({
    baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
    if (memberId !== null) {
        config.params = { ...config.params, member: memberId }
    }

    if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    return config
})

export function getErrorStatus(error: unknown): number | undefined {
    return axios.isAxiosError(error) ? error.response?.status : undefined
}

export function getErrorMessage(error: unknown, fallback = '요청에 실패했어요'): string {
    if (axios.isAxiosError(error)) {
        const data: unknown = error.response?.data
        if (typeof data === 'string' && data !== '') return data
    }
    return fallback
}

export function getFieldErrors(error: unknown): Record<string, string> | null {
    if (!axios.isAxiosError(error) || error.response?.status !== 400) return null

    const data: unknown = error.response.data
    if (typeof data !== 'object' || data === null) return null

    return data as Record<string, string>
}