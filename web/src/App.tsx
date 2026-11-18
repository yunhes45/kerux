import { useEffect, useState } from 'react'
import { health } from './api'
import { Button } from '@/components/ui/button'

export default function App() {
  const [status, setStatus] = useState('확인 중')

  useEffect(() => {
    health()
        .then(setStatus)
        .catch(() => setStatus('서버에 연결할 수 없음'))
  }, [])

    return (
        <main className="flex h-full flex-col items-center justify-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Kerux</h1>
            <p className="rounded-md border bg-muted px-3 py-1 text-sm text-muted-foreground">
                서버 응답: {status}
            </p>
            <Button>시작하기</Button>
        </main>
    )
}