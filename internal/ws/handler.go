package ws

import (
	"context"
	"encoding/json"
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
			_, data, err := conn.Read(ctx)
			if err != nil {
				return
			}

			var env Envelope

			if err := json.Unmarshal(data, &env); err != nil {
				continue
			}

			if env.Type != "chat" || env.Text == "" {
				continue
			}

			out, _ := json.Marshal(env)

			hub.Broadcast(Message{Type: websocket.MessageText, Data: out})
		}
	}
}
