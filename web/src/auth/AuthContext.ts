import { createContext } from 'react'

export type AuthContextValue = {
    memberId: number | null
    login: (identifier: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)