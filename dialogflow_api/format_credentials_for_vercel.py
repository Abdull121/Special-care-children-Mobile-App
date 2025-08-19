# #!/usr/bin/env python3
# """
# Script to format Google credentials JSON for Vercel environment variable.
# This converts the multi-line JSON file into a single-line string suitable for environment variables.
# """

# import json

# def format_credentials():
#     try:
#         # Read the credentials file
#         with open('google-credentials.json', 'r') as f:
#             credentials = json.load(f)
        
#         # Convert to single-line JSON string
#         credentials_string = json.dumps(credentials, separators=(',', ':'))
        
#         print("=" * 80)
#         print("GOOGLE_CREDENTIALS_JSON environment variable value:")
#         print("=" * 80)
#         print(credentials_string)
#         print("=" * 80)
#         print("\nInstructions:")
#         print("1. Copy the JSON string above")
#         print("2. In Vercel dashboard, go to your project settings")
#         print("3. Add environment variable: GOOGLE_CREDENTIALS_JSON")
#         print("4. Paste the JSON string as the value")
#         print("5. Redeploy your application")
        
#     except FileNotFoundError:
#         print("Error: google-credentials.json file not found!")
#     except json.JSONDecodeError:
#         print("Error: Invalid JSON in google-credentials.json file!")
#     except Exception as e:
#         print(f"Error: {e}")

# if __name__ == "__main__":
#     format_credentials()
