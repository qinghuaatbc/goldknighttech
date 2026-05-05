package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ExportData struct {
	Customer map[string]struct {
		Address struct {
			Address string `json:"address"`
			City    string `json:"city"`
		} `json:"address"`
		Alarm struct {
			Panel string         `json:"panel"`
			Zone  map[string]string `json:"zone"`
		} `json:"alarm"`
		Image string `json:"image"`
	} `json:"customer"`
}

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: migrate <export.json>")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://goldknight:goldknight@localhost:5432/goldknightdb?sslmode=disable"
	}

	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer pool.Close()

	data, err := os.ReadFile(os.Args[1])
	if err != nil {
		log.Fatalf("Failed to read file: %v", err)
	}

	var export ExportData
	if err := json.Unmarshal(data, &export); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	for slug, c := range export.Customer {
		slug = strings.TrimSpace(slug)

		var customerID string
		err := pool.QueryRow(context.Background(),
			"SELECT id FROM customers WHERE slug = $1", slug,
		).Scan(&customerID)
		if err != nil {
			log.Printf("SKIP: customer %s not found in DB (slug mismatch)", slug)
			continue
		}

		panel := strings.TrimSpace(c.Alarm.Panel)
		if panel != "" {
			_, _ = pool.Exec(context.Background(),
				"UPDATE customers SET alarm_panel = $1 WHERE id = $2",
				panel, customerID,
			)
		}

		for zk, desc := range c.Alarm.Zone {
			if strings.HasPrefix(zk, "z") || strings.HasPrefix(zk, "zz") {
				_, err := pool.Exec(context.Background(),
					"INSERT INTO alarm_zones (customer_id, zone_key, description) VALUES ($1, $2, $3) ON CONFLICT (customer_id, zone_key) DO UPDATE SET description = $3",
					customerID, zk, desc,
				)
				if err != nil {
					log.Printf("  ERROR zone %s: %v", zk, err)
				}
			}
		}
		fmt.Printf("OK: %s (%s) - %d zones\n", slug, c.Address.Address, len(c.Alarm.Zone))
	}

	fmt.Println("Migration complete!")
}
