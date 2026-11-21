import { useMutation } from '@tanstack/react-query'
import { useState, type SubmitEvent } from 'react'
import { register } from '@/api/member'
import AuthShell from '@/components/auth/AuthShell'
import FormField from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { getErrorMessage, getErrorStatus, getFieldErrors } from '@/lib/api'
import {
    EMAIL_MESSAGE,
    EMAIL_REGEXP,
    MOBILE_MESSAGE,
    MOBILE_REGEXP,
    PASSWORD_MESSAGE,
    PASSWORD_REGEXP,
    USERNAME_MESSAGE,
    USERNAME_REGEXP,
} from '@/lib/validation'

type SignupForm = {
    email: string
    username: string
    realname: string
    mobile: string
    password: string
    passwordConfirm: string
}

type SignupErrors = Partial<Record<keyof SignupForm, string>>

type ServerErrorResult = {
    fields: SignupErrors
    message: string | null
}

const INITIAL_FORM: SignupForm = {
    email: '',
    username: '',
    realname: '',
    mobile: '',
    password: '',
    passwordConfirm: '',
}

const SERVER_FIELD_MESSAGES: SignupErrors = {
    email: EMAIL_MESSAGE,
    username: USERNAME_MESSAGE,
    realname: '이름을 입력해 주세요',
    mobile: MOBILE_MESSAGE,
    password: PASSWORD_MESSAGE,
}

function validate(form: SignupForm): SignupErrors {
    const errors: SignupErrors = {}

    if (!EMAIL_REGEXP.test(form.email)) errors.email = EMAIL_MESSAGE
    if (!USERNAME_REGEXP.test(form.username)) errors.username = USERNAME_MESSAGE
    if (form.realname.trim() === '') errors.realname = '이름을 입력해 주세요'
    if (!MOBILE_REGEXP.test(form.mobile)) errors.mobile = MOBILE_MESSAGE
    if (!PASSWORD_REGEXP.test(form.password)) errors.password = PASSWORD_MESSAGE
    if (form.password !== form.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 서로 달라요'
    }

    return errors
}

function toServerErrors(error: unknown): ServerErrorResult {
    const status = getErrorStatus(error)

    if (status === 400) {
        const fieldErrors = getFieldErrors(error) ?? {}
        const fields: SignupErrors = {}
        for (const key of Object.keys(fieldErrors)) {
            if (key in SERVER_FIELD_MESSAGES) {
                const field = key as keyof SignupForm
                fields[field] = SERVER_FIELD_MESSAGES[field]
            }
        }
        if (Object.keys(fields).length > 0) {
            return { fields, message: null }
        }
    }

    if (status === 409) {
        const text = getErrorMessage(error, '').toLowerCase()
        if (text.includes('email')) {
            return { fields: { email: '이미 가입된 이메일이에요' }, message: null }
        }
        if (text.includes('username')) {
            return { fields: { username: '이미 사용 중인 아이디예요' }, message: null }
        }
        if (text.includes('mobile')) {
            return { fields: { mobile: '이미 가입된 휴대폰 번호예요' }, message: null }
        }
        return { fields: {}, message: '이미 가입된 정보가 있어요. 입력한 내용을 확인해 주세요' }
    }

    return { fields: {}, message: '가입에 실패했어요. 잠시 후 다시 시도해 주세요' }
}

type SignupPageProps = {
    onLogin: () => void
    onDone: () => void
}

function SignupPage({ onLogin, onDone }: SignupPageProps) {
    const [form, setForm] = useState<SignupForm>(INITIAL_FORM)
    const [submitted, setSubmitted] = useState(false)
    const [serverErrors, setServerErrors] = useState<SignupErrors>({})
    const [formError, setFormError] = useState<string | null>(null)

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: onDone,
        onError: (error) => {
            const result = toServerErrors(error)
            setServerErrors(result.fields)
            setFormError(result.message)
        },
    })

    const errors: SignupErrors = { ...(submitted ? validate(form) : {}), ...serverErrors }

    const handleChange = (field: keyof SignupForm) => (event: { target: { value: string } }) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }))
        setServerErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
        setServerErrors({})
        setFormError(null)

        if (Object.keys(validate(form)).length > 0) return

        registerMutation.mutate({
            email: form.email.trim(),
            username: form.username.trim(),
            realname: form.realname.trim(),
            mobile: form.mobile.trim(),
            password: form.password,
        })
    }

    return (
        <AuthShell
            title="회원가입"
            footerText="이미 계정이 있나요?"
            footerLinkLabel="로그인"
            onFooterClick={onLogin}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <FormField
                    id="email"
                    label="이메일"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    autoComplete="email"
                />
                <FormField
                    id="username"
                    label="아이디"
                    value={form.username}
                    onChange={handleChange('username')}
                    error={errors.username}
                    placeholder="예: kerux"
                    autoComplete="username"
                />
                <FormField
                    id="realname"
                    label="이름"
                    value={form.realname}
                    onChange={handleChange('realname')}
                    error={errors.realname}
                    autoComplete="name"
                />
                <FormField
                    id="mobile"
                    label="휴대폰 번호"
                    type="tel"
                    inputMode="numeric"
                    value={form.mobile}
                    onChange={handleChange('mobile')}
                    error={errors.mobile}
                    placeholder="01012345678"
                    autoComplete="tel"
                />
                <FormField
                    id="password"
                    label="비밀번호"
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    error={errors.password}
                    autoComplete="new-password"
                />
                <FormField
                    id="passwordConfirm"
                    label="비밀번호 확인"
                    type="password"
                    value={form.passwordConfirm}
                    onChange={handleChange('passwordConfirm')}
                    error={errors.passwordConfirm}
                    autoComplete="new-password"
                />

                {formError && <p className="text-sm text-destructive">{formError}</p>}

                <Button type="submit" className="mt-2" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? '가입 중…' : '가입하기'}
                </Button>
            </form>
        </AuthShell>
    )
}

export default SignupPage