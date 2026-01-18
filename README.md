Steps to run this code

1. Run the frontend - npm run dev
2. run the backend - 
For Unix/Mac-OS
        a. python3 -m venv venv
        b. source venv/bin/activate
        c. python3 app.py
For Windows:
        a. \venv\Scripts\Activate.ps1
        b. python3 app.py
Incase of blocking by powershell: run command: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser followed by above commands


3. Run the ollama model
         a. start the app ollama

.env data 

MONGO_URI="your mongo db URI"
JWT_SECRET_KEY=your-secret-key 


🧠 1️⃣ Ollama has one single local server process

When you run:

ollama serve


or simply open the Ollama desktop app,
it automatically starts a local API server at:

http://localhost:11434


That server exposes all endpoints for both:

/api/generate → for generating text (LLM)

/api/embeddings → for generating embeddings (vector representation)


![alt text](<Screenshot 2025-11-03 at 4.57.14 PM.png>) ![alt text](<Screenshot 2025-11-03 at 4.56.46 PM.png>)

![alt text](<Screenshot 2025-11-04 at 4.06.39 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.06.46 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.06.53 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.07.22 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.07.29 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.07.37 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.07.59 PM.png>) ![alt text](<Screenshot 2025-11-04 at 4.08.28 PM.png>)