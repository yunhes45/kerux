export function memberIdFromToken(token: string): number | null {
    try {
        const payload = token.split('.')[1]
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        const id = Number(JSON.parse(json).sub)

        return Number.isInteger(id) && id > 0 ? id : null
    } catch {
        return null
    }
}