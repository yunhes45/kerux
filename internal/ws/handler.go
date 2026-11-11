package ws

import (
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
		hub.Add(conn)
		defer hub.Remove(conn)

		for {
			typ, data, err := conn.Read(r.Context())
			if err != nil {
				return
			}
			hub.Broadcast(typ, data)
		}
	}
}
