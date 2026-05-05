package handlers

import (
	"net/http"

	"github.com/goldknighttech/backend/internal/database"
	"github.com/goldknighttech/backend/internal/models"
)

func ListPublicCustomers(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Pool.Query(r.Context(),
		"SELECT id, slug, address_line, city, alarm_panel, COALESCE(image,''), created_at, updated_at FROM customers ORDER BY slug",
	)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	customers := []models.Customer{}
	for rows.Next() {
		var c models.Customer
		if err := rows.Scan(&c.ID, &c.Slug, &c.AddressLine, &c.City, &c.AlarmPanel, &c.Image, &c.CreatedAt, &c.UpdatedAt); err != nil {
			continue
		}

		zoneRows, err := database.Pool.Query(r.Context(),
			"SELECT id, customer_id, zone_key, description, lang, created_at FROM alarm_zones WHERE customer_id = $1 ORDER BY zone_key",
			c.ID,
		)
		if err == nil {
			for zoneRows.Next() {
				var z models.Zone
				if err := zoneRows.Scan(&z.ID, &z.CustomerID, &z.ZoneKey, &z.Description, &z.Lang, &z.CreatedAt); err == nil {
					c.Zones = append(c.Zones, z)
				}
			}
			zoneRows.Close()
		}

		customers = append(customers, c)
	}

	jsonResponse(w, customers, http.StatusOK)
}

func ListLights(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Pool.Query(r.Context(),
		"SELECT id, light_key, entity_id, name, top, left_pos, created_at FROM ha_lights ORDER BY light_key",
	)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	lights := []models.HALight{}
	for rows.Next() {
		var l models.HALight
		if err := rows.Scan(&l.ID, &l.LightKey, &l.EntityID, &l.Name, &l.Top, &l.LeftPos, &l.CreatedAt); err != nil {
			continue
		}
		lights = append(lights, l)
	}

	jsonResponse(w, lights, http.StatusOK)
}

func ListMovies(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Pool.Query(r.Context(),
		"SELECT id, movie_key, name, url, created_at FROM movies ORDER BY movie_key",
	)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	movies := []models.Movie{}
	for rows.Next() {
		var m models.Movie
		if err := rows.Scan(&m.ID, &m.MovieKey, &m.Name, &m.URL, &m.CreatedAt); err != nil {
			continue
		}
		movies = append(movies, m)
	}

	jsonResponse(w, movies, http.StatusOK)
}

func ListSongs(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Pool.Query(r.Context(),
		"SELECT id, song_key, name, url, created_at FROM songs ORDER BY song_key",
	)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	songs := []models.Song{}
	for rows.Next() {
		var s models.Song
		if err := rows.Scan(&s.ID, &s.SongKey, &s.Name, &s.URL, &s.CreatedAt); err != nil {
			continue
		}
		songs = append(songs, s)
	}

	jsonResponse(w, songs, http.StatusOK)
}
