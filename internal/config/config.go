package config

import (
	"errors"
	"os"
)

type Config struct {
	DatabaseURL string
	Addr        string
}

func Load() (Config, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return Config{}, errors.New("DATABASE_URL 환경 변수 필요")
	}

	addr := os.Getenv("KERUX_ADDR")
	if addr == "" {
		addr = ":8081"
	}

	return Config{DatabaseURL: dsn, Addr: addr}, nil
}
