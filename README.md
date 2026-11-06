# cronflare

A simple, neutral Cloudflare Workers cron job script that pings specified links at configurable intervals.

## Overview

cronflare is a Cloudflare Workers script that runs on a schedule and pings specified URLs at a configurable frequency. All configuration is done via environment variables set in the Cloudflare Dashboard, never overridden by the codebase.

## Features

- **Configurable frequency**: Set ping interval in minutes via `CRON_FREQUENCY` env var
- **Multiple links**: Ping any number of URLs comma-separated via `CRON_LINKS` env var
- **Environment-based config**: All settings via Cloudflare Dashboard (never overridden in code)
- **Open source ready**: MIT licensed, clear documentation, no secrets hardcoded
- **Lightweight**: Just makes HTTP GET requests, minimal Cloudflare resource usage

## Quick Setup

### 1. Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

### 2. Initialize & Edit

```bash
wrangler init cronflare
cd cronflare
# Edit the files below as needed
```

### 3. Configure Environment Variables

Go to **Cloudflare Dashboard** > **Your Worker** > **Settings** > **Variables** and add:

| Variable | Description | Example |
|----------|-------------|---------|
| `CRON_FREQUENCY` | Minutes between pings to **each** link | `3` |
| `CRON_LINKS` | Comma-separated list of URLs to ping | `https://example.com/health` |

### 4. Deploy

```bash
wrangler deploy
```

## Configuration Examples

### Ping every 3 minutes


- `CRON_FREQUENCY`: `15`
- `CRON_LINKS`: `https://service1.com,https://service2.com,https://service3.com`

### Custom frequency (every 10 minutes)

- `CRON_FREQUENCY`: `10`
- `CRON_LINKS`: `https://my-api.com/healthcheck`

## How It Works

1. Worker triggers on Cloudflare cron schedule (default frequency configured in dashboard)
2. Reads `CRON_FREQUENCY` env var to determine interval in minutes
3. Reads `CRON_LINKS` env var and splits by comma to get individual URLs
4. Makes HTTP GET request to each link concurrently
5. Waits for all pings to complete before next scheduled run
6. Repeats on the configured schedule

## Safety & Best Practices

- **Never edit `wrangler.toml` vars section** after deployment if using dashboard vars
- Configure all settings via Cloudflare Dashboard > Variables
- Test with a few links before scaling up
- Monitor your Cloudflare logs for any errors
- The worker makes GET requests only - no POST or data modification

## Directory Structure

```
cronflare/
├── package.json       # Project dependencies and scripts
├── wrangler.toml      # Wrangler config (env vars via Dashboard, not overridden here)
├── index.js          # Main Worker script
└── README.md         # This documentation
```

## License

MIT License - free to use, modify, and distribute. See LICENSE for details.

## Development

```bash
# Start local development server
wrangler dev

# Deploy to Cloudflare
wrangler deploy
```

## Need Help?

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/
- Open an issue in the repository for bugs or feature requests
