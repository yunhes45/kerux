package main

import (
	"log"
	"net/http"

	"github.com/coder/websocket"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("GET /ws", echo)

	log.Println("kerux listening on :8081")
	log.Fatal(http.ListenAndServe(":8081", mux))
}

func echo(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println("accept:", err)
		return
	}
	defer conn.CloseNow()

	for {
		typ, data, err := conn.Read(r.Context())
		if err != nil {
			return
		}
		if err := conn.Write(r.Context(), typ, data); err != nil {
			return
		}
	}
}
