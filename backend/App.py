from flask import Flask, jsonify, request
from flask_cors import CORS
import cohere
app = Flask(__name__)

# Enable CORS for the specific origins (localhost:5173 and localhost:8081)
# CORS(app, resources={r"/*": {"origins": [" http://localhost:5173","http://localhost:8081"]}})
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

@app.route('/query', methods=['POST'])
def chat():
    data = request.get_json()  # Get the JSON data sent from the Java server
    prompt = data.get("message")  # Extract the prompt from the JSON
    
    # Create a Cohere client and send the prompt to the chat model
    co = cohere.ClientV2("Y9yCkVlUkr2xZvRYrI5wwIj1CmWHWocax435rzWi")
    response = co.chat(
        model="command-r-plus",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    # Print the full response structure for debugging
    print("Full response from Cohere API:", response)

    # Access the content of the assistant's response
    if response.message and response.message.content:
        assistant_response = response.message.content[0].text  # Access the first content item

    # Return the extracted text in a JSON format
    return jsonify({"response": assistant_response})


if __name__ == '__main__':
    app.run(debug=True)
