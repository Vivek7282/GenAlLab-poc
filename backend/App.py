from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for the specific origin (localhost:5173)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Root route
@app.route('/', methods=['GET'])
def index():
    print("Incoming request to '/' endpoint from React")  # Logs to the console
    return jsonify({"message": "Hello from Flask!"})

# /message route
@app.route('/message', methods=['GET'])
def message():
    print("Incoming request to '/message' endpoint from React")  # Logs to the console
    return jsonify({"message": "This is a message from the /message endpoint!"})

if __name__ == '__main__':
    app.run(debug=True)
