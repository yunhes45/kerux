import { useState } from 'react'
import { useAuth } from '@/auth/useAuth'
import LoginPage from '@/pages/LoginPage'
import RoomsPage from '@/pages/RoomsPage'
import SignupPage from '@/pages/SignupPage'

type Screen = 'login' | 'signup'

function App() {
    const { memberId } = useAuth()
    const [screen, setScreen] = useState<Screen>('login')
    const [notice, setNotice] = useState('')

    if (memberId !== null) return <RoomsPage />

    if (screen === 'signup') {
        return (
            <SignupPage
                onLogin={() => setScreen('login')}
                onDone={() => {
                    setNotice('가입했어요. 로그인해 주세요')
                    setScreen('login')
                }}
            />
        )
    }

    return <LoginPage notice={notice} onSignup={() => setScreen('signup')} />
}

export default App