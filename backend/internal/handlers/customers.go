package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/goldknighttech/backend/internal/database"
	"github.com/goldknighttech/backend/internal/models"
	"github.com/jackc/pgx/v5"
)

func ListCustomers(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("page_size"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize
	search := r.URL.Query().Get("search")

	var total int
	var err error

	if search != "" {
		pattern := "%" + search + "%"
		err = database.Pool.QueryRow(r.Context(),
			"SELECT COUNT(*) FROM customers WHERE address_line ILIKE $1 OR city ILIKE $1 OR slug ILIKE $1",
			pattern,
		).Scan(&total)
		if err != nil {
			jsonError(w, "database error", http.StatusInternalServerError)
			return
		}
	}

	if search == "" {
		err = database.Pool.QueryRow(r.Context(),
			"SELECT COUNT(*) FROM customers",
		).Scan(&total)
		if err != nil {
			jsonError(w, "database error", http.StatusInternalServerError)
			return
		}
	}

	query := "SELECT id, slug, address_line, city, alarm_panel, COALESCE(image,''), created_at, updated_at FROM customers"
	args := []interface{}{}
	argIdx := 1

	if search != "" {
		query += " WHERE address_line ILIKE $" + strconv.Itoa(argIdx) + " OR city ILIKE $" + strconv.Itoa(argIdx) + " OR slug ILIKE $" + strconv.Itoa(argIdx)
		args = append(args, "%"+search+"%")
		argIdx++
	}

	query += " ORDER BY slug LIMIT $" + strconv.Itoa(argIdx) + " OFFSET $" + strconv.Itoa(argIdx+1)
	args = append(args, pageSize, offset)

	rows, err := database.Pool.Query(r.Context(), query, args...)
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
		customers = append(customers, c)
	}

	totalPages := (total + pageSize - 1) / pageSize
	jsonResponse(w, models.PaginatedResponse{
		Data:       customers,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, http.StatusOK)
}

func GetCustomer(w http.ResponseWriter, r *http.Request) {
	slug := extractSlug(r.URL.Path)

	var c models.Customer
	err := database.Pool.QueryRow(r.Context(),
		"SELECT id, slug, address_line, city, alarm_panel, COALESCE(image,''), created_at, updated_at FROM customers WHERE slug = $1",
		slug,
	).Scan(&c.ID, &c.Slug, &c.AddressLine, &c.City, &c.AlarmPanel, &c.Image, &c.CreatedAt, &c.UpdatedAt)

	if err != nil {
		if err == pgx.ErrNoRows {
			jsonError(w, "customer not found", http.StatusNotFound)
			return
		}
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	zoneRows, err := database.Pool.Query(r.Context(),
		"SELECT id, customer_id, zone_key, description, lang, created_at FROM alarm_zones WHERE customer_id = $1 ORDER BY zone_key",
		c.ID,
	)
	if err == nil {
		defer zoneRows.Close()
		for zoneRows.Next() {
			var z models.Zone
			if err := zoneRows.Scan(&z.ID, &z.CustomerID, &z.ZoneKey, &z.Description, &z.Lang, &z.CreatedAt); err == nil {
				c.Zones = append(c.Zones, z)
			}
		}
	}

	jsonResponse(w, c, http.StatusOK)
}

func CreateCustomer(w http.ResponseWriter, r *http.Request) {
	var req models.CustomerCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Slug == "" || req.AddressLine == "" {
		jsonError(w, "slug and address_line are required", http.StatusBadRequest)
		return
	}

	var id string
	err := database.Pool.QueryRow(r.Context(),
		"INSERT INTO customers (slug, address_line, city, alarm_panel, image) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		req.Slug, req.AddressLine, req.City, req.AlarmPanel, req.Image,
	).Scan(&id)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			jsonError(w, "a customer with this slug already exists", http.StatusConflict)
			return
		}
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, map[string]string{"id": id, "message": "customer created"}, http.StatusCreated)
}

func UpdateCustomer(w http.ResponseWriter, r *http.Request) {
	slug := extractSlug(r.URL.Path)

	var req models.CustomerUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	query := "UPDATE customers SET updated_at = NOW()"
	args := []interface{}{}
	argIdx := 1

	if req.AddressLine != nil {
		query += ", address_line = $" + strconv.Itoa(argIdx)
		args = append(args, *req.AddressLine)
		argIdx++
	}
	if req.City != nil {
		query += ", city = $" + strconv.Itoa(argIdx)
		args = append(args, *req.City)
		argIdx++
	}
	if req.AlarmPanel != nil {
		query += ", alarm_panel = $" + strconv.Itoa(argIdx)
		args = append(args, *req.AlarmPanel)
		argIdx++
	}
	if req.Image != nil {
		query += ", image = $" + strconv.Itoa(argIdx)
		args = append(args, *req.Image)
		argIdx++
	}

	query += " WHERE slug = $" + strconv.Itoa(argIdx)
	args = append(args, slug)

	_, err := database.Pool.Exec(r.Context(), query, args...)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, models.MessageResponse{Message: "customer updated"}, http.StatusOK)
}

func DeleteCustomer(w http.ResponseWriter, r *http.Request) {
	slug := extractSlug(r.URL.Path)

	_, err := database.Pool.Exec(r.Context(), "DELETE FROM customers WHERE slug = $1", slug)
	if err != nil {
		jsonError(w, "database error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, models.MessageResponse{Message: "customer deleted"}, http.StatusOK)
}

func extractSlug(path string) string {
	path = strings.TrimPrefix(path, "/api/customers/")
	path = strings.TrimPrefix(path, "/api/public/customers/")
	path = strings.TrimSuffix(path, "/zones")
	parts := strings.SplitN(path, "/", 2)
	return parts[0]
}
