package server

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/yunhes45/kerux/internal/handler"
	"github.com/yunhes45/kerux/internal/repository"
)

func mountFeatures(mux *http.ServeMux, pool *pgxpool.Pool) {
	handler.RegisterHealth(mux)
	handler.RegisterRooms(mux, repository.NewRooms(pool))
}
