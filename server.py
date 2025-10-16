from flask import Flask, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder=None)

DB_FILE = 'db.json'

# Load database from file
def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    # Default structure if file doesn't exist
    return {
        "users": {
            "default": {
                "last_updated": datetime.utcnow().isoformat(),
                "data": {}
            }
        }
    }

# Save database to file
def save_db():
    with open(DB_FILE, 'w') as f:
        json.dump(db, f, indent=4)

db = load_db()

# Serve static files from the root directory
@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('.', path)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API to get all users
@app.route('/api/sync/users', methods=['GET'])
def get_users():
    return jsonify(list(db['users'].keys()))

# API to get all data for all users
@app.route('/api/sync/pull', methods=['GET'])
def pull_all_data():
    # In a real app, you might want to paginate or filter this
    return jsonify(db['users'])

# API to push data for a user
@app.route('/api/sync/push', methods=['POST'])
def push_data():
    payload = request.json
    user = payload.get('user')
    client_timestamp_str = payload.get('last_updated')
    data = payload.get('data')

    if not user or not data:
        return jsonify({"status": "error", "message": "User and data are required."}), 400

    # Initialize user if not exists
    if user not in db['users']:
        db['users'][user] = {"last_updated": datetime.utcnow().isoformat(), "data": {}}

    # Basic concurrency check: last write wins
    server_timestamp = datetime.fromisoformat(db['users'][user]['last_updated']).replace(tzinfo=datetime.now().astimezone().tzinfo).astimezone(tz=None)
    
    # Handle 'Z' suffix for UTC timezone from JavaScript's toISOString()
    if client_timestamp_str.endswith('Z'):
        client_timestamp_str = client_timestamp_str[:-1] + '+00:00'
    client_timestamp = datetime.fromisoformat(client_timestamp_str)

    if client_timestamp >= server_timestamp:
        db['users'][user]['data'] = data
        db['users'][user]['last_updated'] = datetime.utcnow().isoformat()
        save_db() # Persist changes
        print(f"Updated data for user: {user}")
        return jsonify({"status": "success", "message": "Data updated."})
    else:
        print(f"Stale data for user: {user}. Server version is newer.")
        return jsonify({
            "status": "conflict",
            "message": "Server has a newer version of the data.",
            "server_data": db['users'][user]
        }), 409


if __name__ == '__main__':
    app.run(debug=True, port=8000)
