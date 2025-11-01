# Pinger Service

A free GitHub Actions-based service to keep your Render (or other) apps alive by pinging them at regular intervals.

## Features

- ✅ Completely free (runs on GitHub Actions)
- ✅ No server maintenance required
- ✅ Supports both GET and POST requests
- ✅ Configurable ping intervals
- ✅ Custom headers and request bodies
- ✅ Easy configuration via JSON
- ✅ Manual trigger option for testing
- ✅ Detailed logging for each ping

## Setup

### 1. Fork or Clone This Repository

```bash
git clone https://github.com/yourusername/pinger.git
cd pinger
```

### 2. Configure Your Endpoints

Edit `config.json` to add your apps:

```json
{
  "pingInterval": "*/10 * * * *",
  "timeout": 30000,
  "endpoints": [
    {
      "name": "My App",
      "url": "https://my-app.onrender.com",
      "method": "GET"
    }
  ]
}
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Configure pinger endpoints"
git push origin main
```

### 4. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. If prompted, enable GitHub Actions for your repository
4. The pinger will start running automatically based on your schedule

## Quick Reference: Using Secrets

**For POST requests with sensitive data:**

1. In `config.json`, use placeholders:
   ```json
   "body": {
     "username": "${LOGIN_USERNAME}",
     "password": "${LOGIN_PASSWORD}"
   }
   ```

2. In GitHub: Settings → Secrets → New secret → Add `LOGIN_USERNAME` and `LOGIN_PASSWORD`

3. In `.github/workflows/pinger.yml`, add under `env:`:
   ```yaml
   LOGIN_USERNAME: ${{ secrets.LOGIN_USERNAME }}
   LOGIN_PASSWORD: ${{ secrets.LOGIN_PASSWORD }}
   ```

Done! Your secrets are now secure. ✅

## Configuration

### Basic Configuration

The `config.json` file has the following structure:

```json
{
  "pingInterval": "*/10 * * * *",
  "timeout": 30000,
  "endpoints": [...]
}
```

- **pingInterval**: Cron expression for ping frequency (must also update `.github/workflows/pinger.yml`)
- **timeout**: Request timeout in milliseconds (default: 30000)
- **endpoints**: Array of endpoints to ping

### Endpoint Configuration

#### Simple GET Request

```json
{
  "name": "My App",
  "url": "https://my-app.onrender.com",
  "method": "GET"
}
```

#### POST Request with Body

```json
{
  "name": "My App with Login",
  "url": "https://my-app.onrender.com/api/login",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "username": "keepalive",
    "password": "your-password"
  }
}
```

#### Request with Custom Headers

```json
{
  "name": "My App with Auth",
  "url": "https://my-app.onrender.com/api/ping",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-token-here"
  },
  "body": {
    "ping": true
  }
}
```

### Changing Ping Interval

To change how often the pinger runs:

1. Update the `pingInterval` in `config.json` (for documentation)
2. Update the cron expression in `.github/workflows/pinger.yml`:

```yaml
on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
```

Common cron expressions:
- `*/10 * * * *` - Every 10 minutes
- `*/14 * * * *` - Every 14 minutes (common for keeping apps awake)
- `*/30 * * * *` - Every 30 minutes
- `0 * * * *` - Every hour
- `0 */2 * * *` - Every 2 hours

**Note**: GitHub Actions has a minimum interval of 5 minutes.

## Testing

### Manual Trigger

You can manually trigger the pinger from GitHub:

1. Go to the "Actions" tab in your repository
2. Click on "Pinger Service" in the left sidebar
3. Click "Run workflow" button
4. Click the green "Run workflow" button to confirm

### Local Testing

You can test the ping script locally:

```bash
node ping.js
```

This will run the pinger once and show you the results.

## Monitoring

### View Logs

1. Go to the "Actions" tab in your repository
2. Click on any workflow run to see the logs
3. Expand the "Run ping script" step to see detailed ping results

### Check Status

The workflow will show:
- ✓ Green checkmark: All pings successful
- ✗ Red X: One or more pings failed

## GitHub Actions Free Tier

GitHub Actions provides 2,000 minutes per month for free on public repositories. Each ping run takes approximately 10-30 seconds depending on the number of endpoints.

**Example calculation:**
- Running every 10 minutes = 6 runs per hour = 144 runs per day
- 144 runs × 30 days = 4,320 runs per month
- At ~30 seconds per run = 2,160 minutes per month
- **This slightly exceeds the free tier**

**Recommendations:**
- Use 14-minute intervals (saves ~25% runtime): `*/14 * * * *`
- Use 15-minute intervals (saves ~33% runtime): `*/15 * * * *`
- Reduce number of endpoints
- For private repositories, you get 2,000 free minutes per month

## Troubleshooting

### Pinger Not Running

1. Check that GitHub Actions is enabled in your repository
2. Verify the workflow file is in `.github/workflows/pinger.yml`
3. Check the Actions tab for any errors

### Ping Failures

1. Verify the URL is correct and accessible
2. Check if the endpoint requires authentication
3. Ensure the request method (GET/POST) is correct
4. Review the error message in the workflow logs

### Timeout Errors

1. Increase the `timeout` value in `config.json`
2. Check if your app is responding slowly

### Rate Limiting

If you're hitting rate limits on your apps:
1. Increase the ping interval
2. Reduce the number of endpoints
3. Add delays between pings (requires modifying `ping.js`)

## Using GitHub Secrets for Sensitive Data

**IMPORTANT**: Never hardcode passwords, API tokens, or other sensitive information in `config.json`!

### How It Works

The pinger supports environment variable substitution using the `${VAR_NAME}` syntax. These variables are securely passed from GitHub Secrets.

### Step-by-Step Setup

#### 1. Add Placeholders in config.json

Use `${VARIABLE_NAME}` syntax for sensitive values:

```json
{
  "endpoints": [
    {
      "name": "My App with Login",
      "url": "https://my-app.onrender.com/api/login",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "username": "${LOGIN_USERNAME}",
        "password": "${LOGIN_PASSWORD}"
      }
    },
    {
      "name": "App with API Key",
      "url": "https://my-app.onrender.com/api/data",
      "method": "GET",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  ]
}
```

#### 2. Create GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: `LOGIN_USERNAME`, Value: your actual username
   - Name: `LOGIN_PASSWORD`, Value: your actual password
   - Name: `API_TOKEN`, Value: your actual token
   - etc.

#### 3. Update the Workflow File

Edit `.github/workflows/pinger.yml` to pass secrets as environment variables:

```yaml
- name: Run ping script
  run: node ping.js
  env:
    LOGIN_USERNAME: ${{ secrets.LOGIN_USERNAME }}
    LOGIN_PASSWORD: ${{ secrets.LOGIN_PASSWORD }}
    API_TOKEN: ${{ secrets.API_TOKEN }}
```

#### 4. Test Your Setup

1. Push your changes to GitHub
2. Go to **Actions** tab and manually trigger the workflow
3. Check the logs - secrets will be masked as `***`

### Examples

See `config-examples.json` for more examples of using environment variables.

### Local Testing with Secrets

To test locally with environment variables:

```bash
# Set environment variables
export LOGIN_USERNAME="myusername"
export LOGIN_PASSWORD="mypassword"
export API_TOKEN="mytoken"

# Run the script
node ping.js
```

Or use a `.env` file (make sure it's in `.gitignore`):

```bash
# Install dotenv
npm install dotenv

# Create .env file
echo "LOGIN_USERNAME=myusername" > .env
echo "LOGIN_PASSWORD=mypassword" >> .env
echo "API_TOKEN=mytoken" >> .env

# Run with dotenv (requires adding dotenv to ping.js)
node -r dotenv/config ping.js
```

## Security Notes

- ✅ **DO** use GitHub Secrets for sensitive data
- ✅ **DO** use environment variable placeholders `${VAR_NAME}` in config.json
- ✅ **DO** keep `.env` files in `.gitignore` for local testing
- ❌ **DON'T** commit passwords, tokens, or API keys directly in config.json
- ❌ **DON'T** share your secrets in public repositories
- ❌ **DON'T** log sensitive values in your code

## License

MIT License - Feel free to use and modify as needed!

