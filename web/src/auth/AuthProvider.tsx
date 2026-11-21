import { useQueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { requestLogin } from '@/api/auth'
import { AuthContext } from '@/auth/AuthContext'
import { setAccessToken, setMemberId } from '@/lib/api'
import { memberIdFromToken } from '@/lib/jwt'

type AuthProviderProps = {
    children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient()
    const [memberId, setMember] = useState<number | null>(null)

    const login = async (identifier: string, password: string) => {
        const { accessToken } = await requestLogin(identifier, password)
        const id = memberIdFromToken(accessToken)
        if (id === null) throw new Error('잘못된 토큰이에요')

        setAccessToken(accessToken)
        setMemberId(id)
        queryClient.clear()
        setMember(id)
    }

    const logout = () => {
        setAccessToken(null)
        setMemberId(null)
        queryClient.clear()
        setMember(null)
    }

    return <AuthContext.Provider value={{ memberId, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider