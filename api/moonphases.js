// Moon Phase API Module
// Contains all moon phase calculation and API functionality

// API Configuration
const API_KEY = "3SKQTYVMEX3RCQVH5EHFQ2H4P";
const API_BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

// Moon Phase Calculation Functions
function getMoonPhaseName(phase) {
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase > 0 && phase < 0.25) return "Waxing Crescent";
    if (phase === 0.25) return "First Quarter";
    if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
    if (phase === 0.5) return "Full Moon";
    if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
    if (phase === 0.75) return "Last Quarter";
    if (phase > 0.75 && phase < 1) return "Waning Crescent";
    return "Unknown";
}

function getMoonPhaseDescription(phase) {
    if (phase === 0 || phase === 1) return "The moon is not visible from Earth";
    if (phase > 0 && phase < 0.25) return "A thin crescent is visible";
    if (phase === 0.25) return "Half of the moon is illuminated";
    if (phase > 0.25 && phase < 0.5) return "More than half the moon is visible";
    if (phase === 0.5) return "The moon is fully illuminated";
    if (phase > 0.5 && phase < 0.75) return "The illuminated portion is decreasing";
    if (phase === 0.75) return "Half of the moon is illuminated (waning)";
    if (phase > 0.75 && phase < 1) return "A thin crescent is visible (waning)";
    return "";
}

function createMoonVisual(phase) {
    let clipPath;

    if (phase === 0 || phase === 1) {
        // New Moon - completely dark
        clipPath = "circle(0%)";
    } else if (phase < 0.5) {
        // Waxing - illuminated from right
        const percentage = phase * 200;
        clipPath = `ellipse(${percentage}% 100% at ${100 - percentage}% 50%)`;
    } else {
        // Waning - illuminated from left
        const percentage = (1 - phase) * 200;
        clipPath = `ellipse(${percentage}% 100% at ${percentage}% 50%)`;
    }

    return clipPath;
}

// Utility Functions
function formatTime(timeString) {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    } else {
        return date.toLocaleDateString([], { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// API Functions
async function fetchMoonPhasesData(location) {
    const url = `${API_BASE_URL}/${encodeURIComponent(location)}?unitGroup=us&key=${API_KEY}&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.days || data.days.length === 0) {
        throw new Error('No data received from the API');
    }

    return data.days.slice(0, 8); // Return first 8 days (today + next 7)
}

// Export functions for use in other modules
window.MoonPhaseAPI = {
    getMoonPhaseName,
    getMoonPhaseDescription,
    createMoonVisual,
    formatTime,
    formatDate,
    fetchMoonPhasesData
};
