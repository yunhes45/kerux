import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'

type FormFieldProps = ComponentProps<typeof Input> & {
    id: string
    label: string
    error?: string
}

function FormField({ id, label, error, ...inputProps }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <Input id={id} aria-invalid={error ? true : undefined} {...inputProps} />
            {error && <p className="whitespace-pre-line text-xs text-destructive">{error}</p>}
        </div>
    )
}

export default FormField