import https from 'https';
import zlib from 'zlib';
import readline from 'readline';

const metadataMap = new Map();

/**
 * Load metadata from a remote .gz file
 */
export async function loadMetadataFromUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch: ${res.statusCode}`));
            }

            const gunzip = zlib.createGunzip();
            const rl = readline.createInterface({
                input: res.pipe(gunzip),
                crlfDelay: Infinity,
            });

            rl.on('line', (line) => {
                if (line.trim()) {
                    try {
                        const obj = JSON.parse(line);
                        metadataMap.set(obj.asin, {
                            title: obj.title || "Unknown Title",
                            brand: obj.brand || "Unknown Brand"
                        });
                    } catch (err) {
                        console.error('Skipping invalid JSON line:', err);
                    }
                }
            });

            rl.on('close', () => {
                console.log(`Finished loading metadata: ${metadataMap.size} products`);
                resolve();
            });

            rl.on('error', reject);
        }).on('error', reject);
    });
}

/**
 * Lookup product info by ASIN
 */
export function getProductInfo(asin) {
    return metadataMap.get(asin) || { title: "Unknown Title", brand: "Unknown Brand" };
}
