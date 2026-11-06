# cronflare

A simple, neutral Cloudflare Workers cron job script that pings specified links at configurable intervals.

## Overview

cronflare is a Cloudflare Workers script that runs on a schedule and pings specified URLs at a configurable frequency. All configuration is done via environment variables set in the Cloudflare Dashboard, never overridden by the codebase.

## Features


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

| `CRON_LINKS` | Comma-separated list of URLs to ping | `https://example.com/health` |

### 3b. Set the cron trigger in Cloudflare Dashboard

Go to **Workers & Pages > cronflare > Triggers > Cron Triggers > Add cron trigger** and enter a cron expression matching your `CRON_FREQUENCY`.

Example: for `CRON_FREQUENCY = 3`, use `*/3 * * * *` (every 3 minutes).

The trigger is intentionally **not** in `wrangler.toml` — manage it in the dashboard so deploys never overwrite your schedule.


### 4. Deploy

```bash
wrangler deploy
```

## Configuration Examples


### Custom frequency (every 10 minutes)

- `CRON_FREQUENCY`: `10`
- `CRON_LINKS`: `https://my-api.com/healthcheck`

## How It Works

1. Worker triggers on Cloudflare cron schedule (set in Cloudflare Dashboard > Triggers > Cron Triggers)
2. Reads `CRON_LINKS` env var... 
3. Makes HTTP GET request to each link concurrently
4. Waits for all pings to complete before next scheduled run
5. Repeats on the configured schedule

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
