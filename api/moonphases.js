// Moon Phase API Module
// Handles calculation & fetch via serverless API

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
    if (phase === 0 || phase === 1) clipPath = "circle(0%)";
    else if (phase < 0.5) clipPath = `ellipse(${phase*200}% 100% at ${100 - phase*200}% 50%)`;
    else clipPath = `ellipse(${(1 - phase)*200}% 100% at ${(1 - phase)*200}% 50%)`;
    return clipPath;
}

// Utility
function formatTime(timeString) {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString([], { weekday:'long', month:'short', day:'numeric' });
}

// Fetch via serverless API
async function fetchMoonPhasesData(location) {
    const response = await fetch(`/api/getMoonData?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    const data = await response.json();
    if (!data.days || data.days.length === 0) throw new Error('No data received from API');
    return data.days.slice(0, 8); // today + next 7 days
}

// Expose for global use
window.MoonPhaseAPI = {
    getMoonPhaseName,
    getMoonPhaseDescription,
    createMoonVisual,
    formatTime,
    formatDate,
    fetchMoonPhasesData
};
