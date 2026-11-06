/**
 * cronflare - Cloudflare Workers Cron Job Script
 * 
 * Configuration via Environment Variables (set in Cloudflare Dashboard):

*   CRON_LINKS     - Comma-separated list of URLs to ping
 * 
 * NOTES:
 * - Never override env vars in wrangler.toml - configure via Dashboard
 * - Worker pings specified links at the configured frequency
 * - Designed to be lightweight and reliable for open source use
 */

export default {
  /**
   * Scheduled handler - called on cron trigger
   * @param {import('@cloudflare/workers-types').ScheduledEvent} event - Cloudflare event object
   * @param {Object} env - Environment variables (CRON_LINKS)
   * @param {import('@cloudflare/workers-types').ExecutionContext} ctx - Execution context
   */
  async scheduled(event, env, ctx) {
    // CRON_LINKS: comma-separated list of URLs (configure via Dashboard)
    const linksStr = env.CRON_LINKS;
    
    // If config is missing, log and exit
    if (!linksStr) {
      return;
    }
    
    // Parse links - split by comma, trim whitespace, filter empty
    const links = linksStr
      .split(",")
      .map(link => link.trim())
      .filter(link => link.length > 0);
    
    if (links.length === 0) {
      // console.error('cronflare: No valid links configured.');
      return;
    }
    
    // Ping each link concurrently
    const promises = links.map(async (link) => {
      try {
        const response = await fetch(link, {
          method: "GET",
          // keepAlive helps maintain persistent connections
          keepalive: true,
          // timeout: 10000, // 10 second timeout
        });
        
        // Optionally log successful pings
        // console.log(`cronflare: Pinged ${link} - Status: ${response.status}`);
        
      } catch (error) {
        // console.error(`cronflare: Failed to ping ${link}`, error);
      }
    });
    
    // Wait for all pings to complete
    await Promise.all(promises);
  }
};
