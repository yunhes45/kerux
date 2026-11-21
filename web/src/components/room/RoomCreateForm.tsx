import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type SubmitEvent } from 'react'
import { createRoom } from '@/api/room'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/api'

function RoomCreateForm() {
    const { memberId } = useAuth()
    const queryClient = useQueryClient()
    const [peer, setPeer] = useState('')

    const mutation = useMutation({
        mutationFn: createRoom,
        onSuccess: () => {
            setPeer('')
            queryClient.invalidateQueries({ queryKey: ['rooms', memberId] })
        },
    })

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const id = Number(peer)
        if (Number.isInteger(id) && id > 0) mutation.mutate(id)
    }

    return (
        <div className="border-b p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    inputMode="numeric"
                    placeholder="상대 번호로 대화 시작"
                    value={peer}
                    onChange={(event) => setPeer(event.target.value)}
                />
                <Button type="submit" disabled={mutation.isPending}>
                    시작
                </Button>
            </form>
            {mutation.isError && (
                <p className="pt-2 text-sm text-destructive">
                    {getErrorMessage(mutation.error, '방을 만들지 못했어요')}
                </p>
            )}
        </div>
    )
}

export default RoomCreateForm