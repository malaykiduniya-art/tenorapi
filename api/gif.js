// api/getgif.js
export default async function handler(req, res) {
    const { getgif } = req.query;

    if (!getgif) {
        return res.status(400).send("Missing getgif parameter");
    }

    try {
        // 1. Fetch the Tenor page HTML
        const response = await fetch(getgif);
        const html = await response.text();

        // 2. Extract the direct .gif link from the meta tags
        const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+\.gif)"/i);
        
        if (!match) {
            return res.status(404).send("GIF not found on page");
        }

        const directGifUrl = match[1];

        // 3. Fetch the actual GIF binary
        const imageRes = await fetch(directGifUrl);
        const buffer = await imageRes.arrayBuffer();

        // 4. Return the raw image file
        res.setHeader("Content-Type", "image/gif");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).send("Error fetching GIF");
    }
}
