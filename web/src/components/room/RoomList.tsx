import { useQuery } from '@tanstack/react-query'
import { getRooms } from '@/api/room'
import { useAuth } from '@/auth/useAuth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function formatTime(iso: string | null) {
    if (!iso) return '메시지 없음'
    return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function RoomList() {
    const { memberId } = useAuth()

    const { data, error, isPending, refetch } = useQuery({
        queryKey: ['rooms', memberId],
        queryFn: getRooms,
        enabled: memberId !== null,
        refetchOnWindowFocus: false,
    })

    if (isPending) {
        return (
            <div className="flex flex-col gap-4 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-sm text-muted-foreground">
                <p>대화 목록을 불러오지 못했어요.</p>
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                    다시 시도
                </Button>
            </div>
        )
    }

    if (data.length === 0) {
        return <p className="px-4 py-10 text-center text-sm text-muted-foreground">아직 대화가 없어요.</p>
    }

    return (
        <ul>
            {data.map((room) => (
                <li
                    key={room.conversation_id}
                    className="flex items-center gap-3 border-b px-4 py-3 hover:bg-muted"
                >
                    <Avatar>
                        <AvatarFallback>{room.peer_id ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">상대 {room.peer_id}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(room.last_message_at)}</p>
                    </div>
                    {room.unread > 0 && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {room.unread}
            </span>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default RoomList