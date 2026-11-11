package ws

import (
	"context"
	"log"
	"net/http"

	"github.com/coder/websocket"
)

func Handler(hub *Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, nil)

		if err != nil {
			log.Printf("accept: %v", err)
			return
		}
		defer conn.CloseNow()
		client := NewClient(conn)
		ctx, cancel := context.WithCancel(r.Context())
		defer cancel()

		hub.Add(client)
		defer hub.Remove(client)

		go client.WritePump(ctx)

		for {
			typ, data, err := conn.Read(ctx)
			if err != nil {
				return
			}
			hub.Broadcast(Message{Type: typ, Data: data})
		}
	}
}
