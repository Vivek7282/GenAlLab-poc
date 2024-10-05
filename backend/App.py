from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import cohere
import PyPDF2  # For PDF files
import docx  # For DOCX files
import os
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
    return jsonify({"message": "I am connected"}) 

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


# Endpoint to upload a document
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    filename = file.filename

    # Save the file temporarily
    file_path = os.path.join('/tmp', filename)
    file.save(file_path)

    # Extract text from the document
    text = ""
    if filename.endswith('.pdf'):
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = "\n".join(page.extract_text() for page in reader.pages)
    elif filename.endswith('.docx'):
        doc = docx.Document(file_path)
        text = "\n".join(paragraph.text for paragraph in doc.paragraphs)

    # Optionally, remove the file after extraction
    os.remove(file_path)

    return jsonify({"text": text})

@app.route('/docQuery', methods=['POST'])
def query():
    data = request.get_json()
    query = data.get('query')
    document_text = data.get('documentText')

    # Split the document text into smaller segments, e.g., sentences
    # This uses a simple split on periods and can be improved with regex or NLP libraries
    docs = [sentence.strip() for sentence in document_text.split('.') if sentence.strip()]

    # Initialize the Cohere client
    co = cohere.ClientV2("Y9yCkVlUkr2xZvRYrI5wwIj1CmWHWocax435rzWi")
    print("query: ", query)

    # Call the Cohere Rerank API
    response = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=docs,
        top_n=3,
    )

    # Extract relevant documents based on their indices
    ranked_responses = [
        {"document": docs[item.index], "score": item.relevance_score} 
        for item in response.results if docs[item.index]  # Ensure the document exists
    ]

    # Print ranked responses for debugging
    print("ranked_responses: ", ranked_responses)

    # Limit the response to the top N relevant excerpts
    return jsonify(ranked_responses)





@app.route('/summarize-email', methods=['POST'])
def summarize_email():
    data = request.get_json()  # Get the JSON data from the request
    email_content = data.get('emailContent')

    if not email_content:
        return jsonify({"error": "Email content is required."}), 400

    try:
        # Initialize Cohere client
        co = cohere.ClientV2("Y9yCkVlUkr2xZvRYrI5wwIj1CmWHWocax435rzWi")
        
        # Use Cohere's Summarize model to summarize the email
        response = co.summarize(
            text=email_content,
            length='medium',
            format='paragraph',
            model='summarize-xlarge',
            additional_command='',
            temperature=0.3,
        )

        summary = response.summary  # Extract the summary from the response
        # print('Summary:', summary)
        return jsonify({"summary": summary})

    except Exception as e:
        print(f"Error summarizing email: {e}")
        return jsonify({"error": "Failed to summarize email."}), 500


if __name__ == '__main__':
    app.run(debug=True)