import { useState, type SubmitEvent } from 'react'
import { useAuth } from '@/auth/useAuth'
import AuthShell from '@/components/auth/AuthShell'
import FormField from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { getErrorMessage, getErrorStatus } from '@/lib/api'

type LoginPageProps = {
    notice?: string
    onSignup: () => void
}

function LoginPage({ notice, onSignup }: LoginPageProps) {
    const { login } = useAuth()
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setPending(true)
        setError('')

        try {
            await login(identifier.trim(), password)
        } catch (e) {
            setError(
                getErrorStatus(e) === 401
                    ? '아이디 또는 비밀번호가 맞지 않아요'
                    : getErrorMessage(e, '로그인하지 못했어요'),
            )
        } finally {
            setPending(false)
        }
    }

    return (
        <AuthShell
            title="로그인"
            footerText="계정이 없나요?"
            footerLinkLabel="회원가입"
            onFooterClick={onSignup}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {notice && <p className="text-sm">{notice}</p>}
                <FormField
                    id="identifier"
                    label="이메일 또는 아이디"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    autoComplete="username"
                />
                <FormField
                    id="password"
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="mt-2" disabled={pending}>
                    {pending ? '로그인 중…' : '로그인'}
                </Button>
            </form>
        </AuthShell>
    )
}

export default LoginPage