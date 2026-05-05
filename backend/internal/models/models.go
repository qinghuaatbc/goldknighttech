package models

import "time"

type AdminUser struct {
	ID           string    `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	PasswordHash string    `json:"-" db:"password_hash"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Customer struct {
	ID          string    `json:"id" db:"id"`
	Slug        string    `json:"slug" db:"slug"`
	AddressLine string    `json:"address_line" db:"address_line"`
	City        string    `json:"city" db:"city"`
	AlarmPanel  string    `json:"alarm_panel" db:"alarm_panel"`
	Image       string    `json:"image" db:"image"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	Zones       []Zone    `json:"zones,omitempty"`
}

type Zone struct {
	ID          string    `json:"id" db:"id"`
	CustomerID  string    `json:"customer_id" db:"customer_id"`
	ZoneKey     string    `json:"zone_key" db:"zone_key"`
	Description string    `json:"description" db:"description"`
	Lang        string    `json:"lang" db:"lang"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

type ZoneCreateRequest struct {
	ZoneKey     string `json:"zone_key"`
	Description string `json:"description"`
	Lang        string `json:"lang"`
}

type HALight struct {
	ID        string    `json:"id" db:"id"`
	LightKey  string    `json:"light_key" db:"light_key"`
	EntityID  string    `json:"entity_id" db:"entity_id"`
	Name      string    `json:"name" db:"name"`
	Top       string    `json:"top" db:"top"`
	LeftPos   string    `json:"left_pos" db:"left_pos"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Movie struct {
	ID        string    `json:"id" db:"id"`
	MovieKey  string    `json:"movie_key" db:"movie_key"`
	Name      string    `json:"name" db:"name"`
	URL       string    `json:"url" db:"url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Song struct {
	ID        string    `json:"id" db:"id"`
	SongKey   string    `json:"song_key" db:"song_key"`
	Name      string    `json:"name" db:"name"`
	URL       string    `json:"url" db:"url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type CustomerCreateRequest struct {
	Slug        string `json:"slug"`
	AddressLine string `json:"address_line"`
	City        string `json:"city"`
	AlarmPanel  string `json:"alarm_panel"`
	Image       string `json:"image"`
}

type CustomerUpdateRequest struct {
	AddressLine *string `json:"address_line,omitempty"`
	City        *string `json:"city,omitempty"`
	AlarmPanel  *string `json:"alarm_panel,omitempty"`
	Image       *string `json:"image,omitempty"`
}

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Total      int         `json:"total"`
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
	TotalPages int         `json:"total_pages"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
