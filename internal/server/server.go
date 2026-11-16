package server

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/yunhes45/kerux/internal/config"
	"github.com/yunhes45/kerux/internal/handler"
)

func Run(cfg config.Config) error {
	ctx := context.Background()

	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		return fmt.Errorf("db pool: %w", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("db ping: %w", err)
	}
	log.Printf("db connected")

	mux := http.NewServeMux()
	handler.RegisterHealth(mux)

	log.Printf("kerux listening on %s", cfg.Addr)

	return http.ListenAndServe(cfg.Addr, mux)
}
