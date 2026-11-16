package main

import (
	"log"

	"github.com/yunhes45/kerux/internal/config"
	"github.com/yunhes45/kerux/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	if err := server.Run(cfg); err != nil {
		log.Fatal(err)
	}
}
