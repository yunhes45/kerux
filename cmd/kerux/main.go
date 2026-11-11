package main

import (
	"log"
	"net/http"

	"github.com/yunhes45/kerux/internal/ws"
)

func main() {
	hub := ws.NewHub()
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})

	mux.HandleFunc("GET /ws", ws.Handler(hub))
	log.Printf("kerux listening on :8081")
	log.Fatal(http.ListenAndServe(":8081", mux))
}
