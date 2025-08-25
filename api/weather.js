// api/weather.js - Serverless function for Vercel
export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  // Only allow GET requests
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  const { location } = request.query;
  
  if (!location) {
    return response.status(400).json({ error: 'Location parameter is required' });
  }

  try {
    const API_KEY = process.env.API_KEY;
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=us&key=${API_KEY}&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;
    
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();
    
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
