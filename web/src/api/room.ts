import { api } from '@/lib/api'

export type Room = {
    conversation_id: number
    type: string
    peer_id?: number
    unread: number
    last_message_at: string | null
}

export async function getRooms(): Promise<Room[]> {
    const { data } = await api.get<Room[]>('/api/v1/rooms')

    return data
}

export async function createRoom(peerId: number): Promise<{ conversation_id: number }> {
    const { data } = await api.post<{ conversation_id: number }>('/api/v1/rooms', { peer_id: peerId })

    return data
}