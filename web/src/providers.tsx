import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import AuthProvider from '@/auth/AuthProvider'

type ProvidersProps = {
    children: ReactNode
}

function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    )
}

export default Providers