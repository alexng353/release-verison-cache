const PORT = process.env.PORT || 3000;
const cache_time = 60 * 1000;
let latest_cache = Date.now();

let cache: string | null = null;

async function refresh_cache() {
  console.log('Refreshing cache');
  const response = await fetch('https://api.github.com/repos/railwayapp/cli/releases/latest');
  const json = await response.json();
  cache = json.tag_name;
  latest_cache = Date.now();
}

async function get_latest_release() {
  if (cache === null) {
    await refresh_cache();
  }
  if (Date.now() - latest_cache > cache_time) {
    void refresh_cache();
  }
  return cache;
}

console.log('Starting server on port', PORT);
Bun.serve({
  port: PORT,
  async fetch(_request) {
    return new Response(await get_latest_release());
  },
});
