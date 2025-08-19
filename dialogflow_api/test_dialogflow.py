#!/usr/bin/env python3
"""
Test script to verify Dialogflow setup and permissions.
"""

import os
import json
from google.oauth2 import service_account
from google.cloud import dialogflow_v2 as dialogflow

def test_credentials():
    """Test if credentials can be loaded properly."""
    print("🔍 Testing credential loading...")
    
    try:
        # Try environment variable first
        google_credentials_json = os.getenv('GOOGLE_CREDENTIALS_JSON')
        if google_credentials_json:
            print("✅ Found GOOGLE_CREDENTIALS_JSON environment variable")
            credentials_info = json.loads(google_credentials_json)
            credentials = service_account.Credentials.from_service_account_info(credentials_info)
        else:
            print("📁 Using google-credentials.json file")
            credentials = service_account.Credentials.from_service_account_file('google-credentials.json')
        
        print(f"✅ Credentials loaded for: {credentials.service_account_email}")
        print(f"✅ Project ID: {credentials.project_id}")
        return credentials
        
    except Exception as e:
        print(f"❌ Error loading credentials: {e}")
        return None

def test_dialogflow_client(credentials):
    """Test if Dialogflow client can be created."""
    print("\n🔍 Testing Dialogflow client creation...")
    
    try:
        session_client = dialogflow.SessionsClient(credentials=credentials)
        print("✅ Dialogflow SessionsClient created successfully")
        return session_client, credentials.project_id
        
    except Exception as e:
        print(f"❌ Error creating Dialogflow client: {e}")
        return None, None

def test_dialogflow_api(session_client, project_id):
    """Test actual Dialogflow API call."""
    print("\n🔍 Testing Dialogflow API call...")
    
    try:
        # Create a test session
        session_id = "test-session-123"
        session = session_client.session_path(project_id, session_id)
        
        # Create a simple text input
        text_input = dialogflow.TextInput(text="Hello", language_code="en-US")
        query_input = dialogflow.QueryInput(text=text_input)
        
        # Make the API call
        response = session_client.detect_intent(
            request={"session": session, "query_input": query_input}
        )
        
        print("✅ Dialogflow API call successful!")
        print(f"✅ Response: {response.query_result.fulfillment_text}")
        return True
        
    except Exception as e:
        error_str = str(e)
        print(f"❌ Dialogflow API call failed: {error_str}")
        
        # Provide specific guidance based on error
        if "401" in error_str or "authentication" in error_str.lower():
            print("\n💡 This looks like an authentication issue. Please check:")
            print("   1. Dialogflow API is enabled in Google Cloud Console")
            print("   2. Service account has proper IAM permissions")
            print("   3. Credentials are valid and not expired")
            
        elif "403" in error_str or "permission" in error_str.lower():
            print("\n💡 This looks like a permissions issue. Please check:")
            print("   1. Service account has 'Dialogflow API Client' role")
            print("   2. Service account has 'Dialogflow API Reader' role")
            
        elif "not found" in error_str.lower() or "project" in error_str.lower():
            print("\n💡 This looks like a project issue. Please check:")
            print("   1. Project ID is correct")
            print("   2. Dialogflow agent exists in the project")
            print("   3. Project has Dialogflow API enabled")
            
        return False

def main():
    print("🚀 Starting Dialogflow setup verification...\n")
    
    # Test 1: Credentials
    credentials = test_credentials()
    if not credentials:
        print("\n❌ Cannot proceed without valid credentials")
        return
    
    # Test 2: Client creation
    session_client, project_id = test_dialogflow_client(credentials)
    if not session_client:
        print("\n❌ Cannot proceed without valid Dialogflow client")
        return
    
    # Test 3: API call
    api_success = test_dialogflow_api(session_client, project_id)
    
    print("\n" + "="*60)
    if api_success:
        print("🎉 All tests passed! Your Dialogflow setup is working correctly.")
    else:
        print("⚠️  Some tests failed. Please follow the guidance above to fix the issues.")
    print("="*60)

if __name__ == "__main__":
    main()
