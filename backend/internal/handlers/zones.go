package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/goldknighttech/backend/internal/database"
	"github.com/goldknighttech/backend/internal/models"
	"github.com/jackc/pgx/v5"
)

func ListZones(w http.ResponseWriter, r *http.Request) {
	slug := extractSlug(r.URL.Path)
	lang := r.URL.Query().Get("lang")
	if lang == "" {
		lang = "en"
	}

	var customerID string
	err := database.Pool.QueryRow(r.Context(),
		"SELECT id FROM customers WHERE slug = $1", slug,
	).Scan(&customerID)
	if err != nil {
		if err == pgx.ErrNoRows {
			jsonError(w, "customer not found", http.StatusNotFound)
			return
		}
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	rows, err := database.Pool.Query(r.Context(),
		"SELECT id, customer_id, zone_key, description, lang, created_at FROM alarm_zones WHERE customer_id = $1 AND lang = $2 ORDER BY zone_key",
		customerID, lang,
	)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	zones := []models.Zone{}
	for rows.Next() {
		var z models.Zone
		if err := rows.Scan(&z.ID, &z.CustomerID, &z.ZoneKey, &z.Description, &z.Lang, &z.CreatedAt); err != nil {
			continue
		}
		zones = append(zones, z)
	}

	jsonResponse(w, zones, http.StatusOK)
}

func CreateZone(w http.ResponseWriter, r *http.Request) {
	slug := extractSlug(r.URL.Path)

	var customerID string
	err := database.Pool.QueryRow(r.Context(),
		"SELECT id FROM customers WHERE slug = $1", slug,
	).Scan(&customerID)
	if err != nil {
		jsonError(w, "customer not found", http.StatusNotFound)
		return
	}

	var req models.ZoneCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.ZoneKey == "" {
		jsonError(w, "zone_key is required", http.StatusBadRequest)
		return
	}
	if req.Lang == "" {
		req.Lang = "en"
	}

	_, err = database.Pool.Exec(r.Context(),
		"INSERT INTO alarm_zones (customer_id, zone_key, description, lang) VALUES ($1, $2, $3, $4) ON CONFLICT (customer_id, zone_key, lang) DO UPDATE SET description = $3",
		customerID, req.ZoneKey, req.Description, req.Lang,
	)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, models.MessageResponse{Message: "zone created"}, http.StatusCreated)
}

func DeleteZone(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/customers/")
	path = strings.TrimPrefix(path, "/api/public/customers/")
	parts := strings.SplitN(path, "/zones/", 2)
	if len(parts) != 2 {
		jsonError(w, "invalid path", http.StatusBadRequest)
		return
	}
	slug := parts[0]
	zoneKey := parts[1]

	lang := r.URL.Query().Get("lang")

	var customerID string
	err := database.Pool.QueryRow(r.Context(),
		"SELECT id FROM customers WHERE slug = $1", slug,
	).Scan(&customerID)
	if err != nil {
		jsonError(w, "customer not found", http.StatusNotFound)
		return
	}

	if lang != "" {
		_, err = database.Pool.Exec(r.Context(),
			"DELETE FROM alarm_zones WHERE customer_id = $1 AND zone_key = $2 AND lang = $3",
			customerID, zoneKey, lang,
		)
	} else {
		_, err = database.Pool.Exec(r.Context(),
			"DELETE FROM alarm_zones WHERE customer_id = $1 AND zone_key = $2",
			customerID, zoneKey,
		)
	}
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, models.MessageResponse{Message: "zone deleted"}, http.StatusOK)
}
