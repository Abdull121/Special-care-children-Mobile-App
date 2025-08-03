import uuid
from google.cloud import dialogflow_v2 as dialogflow
from google.oauth2 import service_account

# Setup credentials from JSON file
GOOGLE_CREDENTIALS = "google-credentials.json"
credentials = service_account.Credentials.from_service_account_file(GOOGLE_CREDENTIALS)

# Get project ID from the credentials
PROJECT_ID = credentials.project_id

def detect_intent_texts(text, language_code="en-US"):
    try:
        if not PROJECT_ID:
            return "Error: GOOGLE_PROJECT_ID not configured"
        
        session_client = dialogflow.SessionsClient(credentials=credentials)
        session_id = str(uuid.uuid4())  # Use a unique session for each request
        session = session_client.session_path(PROJECT_ID, session_id)

        text_input = dialogflow.TextInput(text=text, language_code=language_code)
        query_input = dialogflow.QueryInput(text=text_input)

        response = session_client.detect_intent(
            request={"session": session, "query_input": query_input}
        )
        return response.query_result.fulfillment_text or "No response from Dialogflow."
    
    except Exception as e:
        print("Dialogflow Error:", e)
        return f"Dialogflow error: {str(e)}"
