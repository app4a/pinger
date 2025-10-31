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

## Security Notes

- Never commit sensitive credentials directly in `config.json`
- Consider using GitHub Secrets for sensitive data (requires modifying the workflow)
- Use environment variables for passwords and tokens when possible

## License

MIT License - Feel free to use and modify as needed!

