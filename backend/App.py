from flask import Flask, jsonify, request, Response
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
    return jsonify({"message": "I am connected 😁"}) 

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

# POST route to receive the user prompt
@app.route('/send-stream', methods=['POST'])
def send_stream():
    global current_prompt
    data = request.get_json()
    current_prompt = data.get("message")  # Store the prompt in a global variable or session
    return jsonify({"status": "ok"})

# GET route to stream the response
@app.route('/stream-chat', methods=['GET'])
def stream_chat():
    global current_prompt
    if not current_prompt:
        return "No prompt available", 400
    
    # Create a Cohere client and initialize the chat stream
    co = cohere.ClientV2("Y9yCkVlUkr2xZvRYrI5wwIj1CmWHWocax435rzWi")
    response = co.chat_stream(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "user",
                "content": current_prompt
            }
        ]
    )

    def generate():
        # Stream the chat response as events
        for event in response:
            if event.type == "content-delta":
                chunk = event.delta.message.content.text
                yield f"data: {chunk}\n\n"  # SSE format (Server-Sent Events)

    return Response(generate(), content_type="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True)
