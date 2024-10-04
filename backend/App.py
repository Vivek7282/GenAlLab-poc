from flask import Flask, jsonify

app = Flask(__name__)

# Test route
@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)
