import uuid  # unique session IDs for Dialogflow requests
import os # for environment variable access
import json # for JSON parsing
from google.cloud import dialogflow_v2 as dialogflow # Dialogflow client library api acces
from google.oauth2 import service_account # for Google service account credentials

def get_credentials():
    # Try to get credentials from environment variable (for production/Vercel)
    google_credentials_json = os.getenv('GOOGLE_CREDENTIALS_JSON')

    if google_credentials_json:
        try:
            # Parse the JSON string from environment variable
            credentials_info = json.loads(google_credentials_json)
            credentials = service_account.Credentials.from_service_account_info(credentials_info)
            return credentials
        except (json.JSONDecodeError, Exception) as e:
            print(f"Error parsing GOOGLE_CREDENTIALS_JSON: {e}")

    # Fall back to JSON file (for local development)
    try:
        GOOGLE_CREDENTIALS = "google-credentials.json"
        credentials = service_account.Credentials.from_service_account_file(GOOGLE_CREDENTIALS)
        return credentials
    except Exception as e:
        print(f"Error loading credentials from file: {e}")
        raise Exception("Could not load Google credentials from environment variable or file")

# Initialize credentials
credentials = get_credentials()
PROJECT_ID = credentials.project_id

def detect_intent_texts(text, language_code="en-US"):
    try:
        if not PROJECT_ID:
            return "Error: GOOGLE_PROJECT_ID not configured"

        if not credentials:
            return "Error: Google credentials not properly configured"

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
        error_message = str(e)

        # Provide more specific error messages for common issues
        if "401" in error_message or "authentication" in error_message.lower():
            return "Dialogflow error: Authentication failed. Please check Google credentials configuration."
        elif "403" in error_message or "permission" in error_message.lower():
            return "Dialogflow error: Permission denied. Please check service account permissions."
        elif "project" in error_message.lower():
            return f"Dialogflow error: Project '{PROJECT_ID}' not found or not accessible."
        else:
            return f"Dialogflow error: {error_message}"
