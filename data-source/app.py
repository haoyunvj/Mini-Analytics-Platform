from flask import Flask, jsonify
import csv

app = Flask(__name__)

CSV_FILE = "data.csv"

def read_csv():
    orders = []

    with open(CSV_FILE, newline="", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file, delimiter=",")

        print("Colunas detectadas:", reader.fieldnames)

        for row in reader:
            orders.append({
                "order_id": row.get("order_id"),
                "created_at": row.get("created_at"),
                "status": row.get("status"),
                "value": float(row.get("value", 0)),
                "payment_method": row.get("payment_method")
            })

    return orders

@app.route("/orders", methods=["GET"])
def get_orders():
    return jsonify(read_csv())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
