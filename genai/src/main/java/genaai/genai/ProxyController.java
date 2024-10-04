package genaai.genai;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from this origin
public class ProxyController {

    private final String FLASK_SERVER_URL = "http://127.0.0.1:5000"; // Flask server URL

    // Endpoint to forward the request to the Flask server
    @GetMapping("/forward-to-python")
    public ResponseEntity<String> forwardToPython() {
        RestTemplate restTemplate = new RestTemplate();
        System.out.println("Received user message: ");
        String flaskEndpoint = FLASK_SERVER_URL + "/message";  // Flask endpoint to be called
        HttpEntity<String> request = new HttpEntity<>("");

        // Forward the request to Flask server and get response
        ResponseEntity<String> response = restTemplate.exchange(
                flaskEndpoint, HttpMethod.GET, request, String.class);

        // Return Flask server's response to frontend
        return response;
    }

   @PostMapping("/query")
public ResponseEntity<String> handleChatPrompt(@RequestBody Map<String, String> requestBody) {


    String userMessage = requestBody.get("message");  // Get the message sent from the frontend
    System.out.println("Received user message: " + userMessage);

    if (userMessage == null || userMessage.isEmpty()) {
        return ResponseEntity.badRequest().body("Message is empty or not received!");
    }

    // Forward the message to the Flask server as JSON
    RestTemplate restTemplate = new RestTemplate();
    String flaskEndpoint = FLASK_SERVER_URL + "/query";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, String> jsonMessage = new HashMap<>();
    jsonMessage.put("message", userMessage);

    HttpEntity<Map<String, String>> request = new HttpEntity<>(jsonMessage, headers);
    
    // Send the request to the Flask server
    ResponseEntity<String> response = restTemplate.exchange(flaskEndpoint, HttpMethod.POST, request, String.class);
    System.out.println("Received response message: " + response);
    return response;
}



}
