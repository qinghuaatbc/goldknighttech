package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/goldknighttech/backend/internal/database"
	"github.com/goldknighttech/backend/internal/handlers"
	"github.com/goldknighttech/backend/internal/middleware"
)

func main() {
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/login", handlers.Login)

	mux.HandleFunc("GET /api/public/customers", handlers.ListPublicCustomers)
	mux.HandleFunc("GET /api/public/customers/", handleGetPublicCustomer)
	mux.HandleFunc("GET /api/public/lights", handlers.ListLights)
	mux.HandleFunc("GET /api/public/movies", handlers.ListMovies)
	mux.HandleFunc("GET /api/public/songs", handlers.ListSongs)
	mux.HandleFunc("POST /api/chat", handlers.Chat)

	admin := http.NewServeMux()
	admin.HandleFunc("GET /api/customers", handlers.ListCustomers)
	admin.HandleFunc("POST /api/customers", handlers.CreateCustomer)
	admin.HandleFunc("GET /api/customers/", handleGetCustomer)
	admin.HandleFunc("PUT /api/customers/", handleUpdateCustomer)
	admin.HandleFunc("DELETE /api/customers/", handleDeleteCustomer)
	admin.HandleFunc("POST /api/customers/", handleCreateZone)

	mux.Handle("/api/customers", middleware.AuthMiddleware(admin))
	mux.Handle("/api/customers/", middleware.AuthMiddleware(admin))

	handler := middleware.CORS(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func handleGetPublicCustomer(w http.ResponseWriter, r *http.Request) {
	handlers.GetCustomer(w, r)
}

func handleGetCustomer(w http.ResponseWriter, r *http.Request) {
	handlers.GetCustomer(w, r)
}

func handleUpdateCustomer(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/customers/")
	if strings.HasSuffix(path, "/zones") {
		return
	}
	handlers.UpdateCustomer(w, r)
}

func handleDeleteCustomer(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/customers/")
	parts := strings.Split(path, "/zones/")
	if len(parts) > 1 {
		handlers.DeleteZone(w, r)
		return
	}
	if strings.HasSuffix(path, "/zones") {
		return
	}
	handlers.DeleteCustomer(w, r)
}

func handleCreateZone(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/customers/")
	if strings.HasSuffix(path, "/zones") {
		handlers.CreateZone(w, r)
		return
	}
	handlers.UpdateCustomer(w, r)
}
