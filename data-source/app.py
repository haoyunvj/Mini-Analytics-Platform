import csv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime
from prometheus_flask_exporter import PrometheusMetrics
import psycopg2

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

DB_HOST = "db"
DB_NAME = "analytics"
DB_USER = "postgres"
DB_PASS = "postgres"

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS
    )
    return conn

# Rota para criar usuário (pode ser protegida ou usada apenas no setup)
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return {"success": False, "message": "Preencha username e senha"}, 400

    pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, pw_hash),
        )
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return {"success": False, "message": "Usuário já existe"}, 409
    finally:
        cur.close()
        conn.close()

    return {"success": True, "message": "Usuário criado"}

# Rota de login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return {"success": False, "message": "Preencha username e senha"}, 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT password_hash FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and bcrypt.check_password_hash(user[0], password):
        # Retorne token real (JWT) em produção
        return {"success": True, "token": "fake-token-for-demo"}
    return {"success": False, "message": "Usuário ou senha incorretos"}, 401

metrics = PrometheusMetrics(app)

CSV_FILE = "data.csv"

def parse_float(value_str):
    if value_str is None:
        return 0.0
    return float(value_str.replace(",", "."))

@app.route("/orders")
def get_orders():
    orders = []

    with open(CSV_FILE, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            if not row.get("order_id"):
                continue

            created_at = datetime.fromisoformat(
                row.get("created_at").replace("Z", "+00:00")
            )

            orders.append({
                "order_id": row.get("order_id"),
                "created_at": created_at.isoformat(),
                "status": row.get("status"),
                "value": parse_float(row.get("value")),
                "payment_method": row.get("payment_method")
            })

    return jsonify(orders)

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/analytics/revenue")
def revenue():
    result = db.execute("""
        SELECT DATE(order_date) as day, SUM(amount) as total
        FROM orders
        GROUP BY day
        ORDER BY day
    """)
    return jsonify(result)

@app.route("/analytics/status")
def status():
    result = db.execute("""
        SELECT status, COUNT(*) as total
        FROM orders
        GROUP BY status
    """)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
