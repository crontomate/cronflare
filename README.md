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

### 3b. Create the KV namespace (for dynamic frequency)

The worker triggers every minute and uses a Cloudflare KV store (`CRON_STATE`) to decide when `CRON_FREQUENCY` minutes have elapsed since the last ping. Create it once:

```bash
wrangler kv namespace create CRON_STATE
```

Paste the returned namespace id into `wrangler.toml` under `[[kv_namespaces]]` (`binding = "CRON_STATE"`). Then deploy.

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

1. Worker triggers every minute on the Cloudflare cron schedule (`* * * * *`)
2. Reads `CRON_FREQUENCY` env var (minutes) and checks the `CRON_STATE` KV store to see if that many minutes have elapsed since the last run; exits early if not due yet
3. Reads `CRON_LINKS` env var and splits by comma to get individual URLs
4. Makes HTTP GET request to each link concurrently
5. Waits for all pings to complete, then records the run time in KV
6. Repeats every minute, pinging only when `CRON_FREQUENCY` minutes have passed

## Safety & Best Practices

- **Never edit `wrangler.toml` vars section** after deployment if using dashboard vars
- Configure all settings via Cloudflare Dashboard > Variables
- Test with a few links before scaling up
- Monitor your Cloudflare logs for any errors
- The worker makes GET requests only - no POST or data modification

## Directory Structure

```
cronflare/
â”œâ”€â”€ package.json       # Project dependencies and scripts
â”œâ”€â”€ wrangler.toml      # Wrangler config (env vars via Dashboard, not overridden here)
â”œâ”€â”€ index.js          # Main Worker script
â””â”€â”€ README.md         # This documentation
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


