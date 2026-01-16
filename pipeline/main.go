package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type Order struct {
	OrderID       string  `json:"order_id"`
	CreatedAt     string  `json:"created_at"`
	Status        string  `json:"status"`
	Value         float64 `json:"value"`
	PaymentMethod string  `json:"payment_method"`
}

func fetchOrders() ([]Order, error) {
	resp, err := http.Get("http://data-source:5001/orders")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var orders []Order
	err = json.Unmarshal(body, &orders)
	return orders, err
}

func connectDB() (*sql.DB, error) {
	connStr := "host=postgres user=admin password=admin dbname=analytics sslmode=disable"
	return sql.Open("postgres", connStr)
}

func insertOrders(db *sql.DB, orders []Order) error {
	query := `
	INSERT INTO raw_data.orders 
	(order_id, created_at, status, value, payment_method)
	VALUES ($1, $2, $3, $4, $5)
	ON CONFLICT (order_id) DO NOTHING;
	`

	for _, o := range orders {
		_, err := db.Exec(query, o.OrderID, o.CreatedAt, o.Status, o.Value, o.PaymentMethod)
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	fmt.Println("Iniciando pipeline...")

	orders, err := fetchOrders()
	if err != nil {
		fmt.Println("Erro ao buscar dados:", err)
		os.Exit(1)
	}

	db, err := connectDB()
	if err != nil {
		fmt.Println("Erro ao conectar no banco:", err)
		os.Exit(1)
	}
	defer db.Close()

	err = insertOrders(db, orders)
	if err != nil {
		fmt.Println("Erro ao inserir dados:", err)
		os.Exit(1)
	}

	fmt.Println("Pipeline finalizado com sucesso.")
}
