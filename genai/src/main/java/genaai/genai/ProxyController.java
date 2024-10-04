package genaai.genai;  // Ensure the package declaration is correct

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class ProxyController {

    private final String FLASK_SERVER_URL = "http://127.0.0.1:5000"; // Flask server URL

    // Endpoint to forward the request to the Flask server
    @GetMapping("/forward-to-python")
    public ResponseEntity<String> forwardToPython() {
        RestTemplate restTemplate = new RestTemplate();
        String flaskEndpoint = FLASK_SERVER_URL + "/message";  // Flask endpoint to be called
        HttpEntity<String> request = new HttpEntity<>("");

        // Forward the request to Flask server and get response
        ResponseEntity<String> response = restTemplate.exchange(
                flaskEndpoint, HttpMethod.GET, request, String.class);

        // Return Flask server's response to frontend
        return response;
    }
}
