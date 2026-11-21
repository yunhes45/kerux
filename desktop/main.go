package main

import (
	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

func main() {
	app := application.New(application.Options{
		Name: "Kerux",
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:  "Kerux",
		Width:  420,
		Height: 760,
		URL:    "http://localhost:5173",
	})

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
