import type { ReactNode } from 'react'

type AuthShellProps = {
    title: string
    children: ReactNode
    footerText: string
    footerLinkLabel: string
    onFooterClick: () => void
}

function AuthShell({ title, children, footerText, footerLinkLabel, onFooterClick }: AuthShellProps) {
    return (
        <div className="flex min-h-full items-center justify-center px-10 py-12">
            <div className="w-full max-w-sm">
                <h1 className="mb-6 text-xl font-medium">{title}</h1>

                {children}

                <p className="mt-6 text-sm text-muted-foreground">
                    {footerText}{' '}
                    <button type="button" onClick={onFooterClick} className="font-medium text-foreground underline">
                        {footerLinkLabel}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default AuthShell