// /api/getMoonData.js
// Vercel Serverless Function

import fetch from "node-fetch";

export default async function handler(req, res) {
    const { location } = req.query;
    const API_KEY = process.env.VC_API_KEY; // Set this in Vercel environment variables
    const API_BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

    if (!location) return res.status(400).json({ error: "Location is required" });

    try {
        const url = `${API_BASE_URL}/${encodeURIComponent(location)}?unitGroup=us&key=${API_KEY}&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
