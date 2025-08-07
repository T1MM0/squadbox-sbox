# OpenAI API Key Setup for Squabdox

To use the AI code generation features of Squabdox, you need to set up an OpenAI API key.

## Steps to Set Up OpenAI API Key

1. **Create an OpenAI Account**: If you don't already have one, create an account at [platform.openai.com](https://platform.openai.com).

2. **Generate an API Key**: 
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Give it a name (e.g., "Squabdox API Key")
   - Copy the generated key

3. **Choose an API Key Setup Method**:

   ### Option 1: Direct API Key in .env File (Recommended for Development)
   
   - Create a file named `.env` in the root directory of the project
   - Add the following line to the file:
     ```
     OPENAI_API_KEY=your_key_here
     ```
   - Replace `your_key_here` with the API key you copied in step 2

   ### Option 2: API Key in Separate File (More Secure)
   
   - Create a file (e.g., `openai_key.txt`) in a secure location with restrictive permissions
   - Add your API key as the only content of this file (no quotes, just the raw key)
   - In your `.env` file, specify the path to this key file:
     ```
     OPENAI_API_KEY_PATH=/path/to/your/openai_key.txt
     ```

4. **Restart the Application**:
   - If the application is running, stop it and restart it to load the new environment variables

## Note on API Usage

- OpenAI API usage incurs costs based on the model used and the number of tokens processed
- The Squabdox application uses GPT-4 by default, which costs more than GPT-3.5
- Be aware of your usage limits and monitor your OpenAI dashboard to avoid unexpected charges

## Troubleshooting

If you encounter any issues with the AI code generation:

1. Verify that your API key is correctly added to the `.env` file
2. Check that you have the `python-dotenv` package installed (`pip install python-dotenv`)
3. Ensure that you have billing set up on your OpenAI account
4. Check the backend logs for any API-related errors

## Alternative: Passing API Key Directly

If you prefer not to use an `.env` file, you can pass the API key directly when initializing the AICodeGenerator:

```python
from ai_generator import AICodeGenerator

# Create generator with API key
generator = AICodeGenerator(api_key="your_api_key_here")
```

However, using the `.env` file is the recommended approach for security reasons.