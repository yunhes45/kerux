export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export async function health(): Promise<string> {
    const res = await fetch(`${API_BASE}/healthz`)
    return res.text()
}


