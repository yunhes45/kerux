import { useAuth } from '@/auth/useAuth'
import RoomCreateForm from '@/components/room/RoomCreateForm'
import RoomList from '@/components/room/RoomList'
import { Button } from '@/components/ui/button'

function RoomsPage() {
    const { memberId, logout } = useAuth()

    return (
        <main className="mx-auto flex h-full max-w-md flex-col border-x">
            <header className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Kerux</h1>
                    <p className="text-xs text-muted-foreground">내 번호 {memberId}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                    나가기
                </Button>
            </header>

            <RoomCreateForm />

            <div className="flex-1 overflow-y-auto">
                <RoomList />
            </div>
        </main>
    )
}

export default RoomsPage