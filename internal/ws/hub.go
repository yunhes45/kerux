package ws

import (
	"context"
	"sync"
	"time"

	"github.com/coder/websocket"
)

type Hub struct {
	mu    sync.Mutex
	conns map[*websocket.Conn]struct{}
}

func NewHub() *Hub {
	return &Hub{conns: make(map[*websocket.Conn]struct{})}
}

func (h *Hub) Add(c *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.conns[c] = struct{}{}
}

func (h *Hub) Remove(c *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.conns, c)
}

func (h *Hub) Broadcast(typ websocket.MessageType, data []byte) {
	h.mu.Lock()
	targets := make([]*websocket.Conn, 0, len(h.conns))
	for c := range h.conns {
		targets = append(targets, c)
	}
	h.mu.Unlock()

	for _, c := range targets {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		_ = c.Write(ctx, typ, data)

		cancel()
	}
}
