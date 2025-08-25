// Main Application Script
// Handles UI interactions and orchestrates the application

// Global state
let fullMoonData = [];

// Main Functions
async function fetchMoonPhases() {
    const location = document.getElementById('location').value.trim();

    if (!location) {
        showError('Please enter a location.');
        return;
    }

    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const moonPhasesEl = document.getElementById('moonPhases');
    const fetchBtn = document.getElementById('fetchBtn');

    // Show loading state
    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    moonPhasesEl.innerHTML = '';
    fetchBtn.disabled = true;

    try {
        // Fetch from Vercel serverless API
        const response = await fetch(`/api/getMoonData?location=${encodeURIComponent(location)}`);
        if (!response.ok) throw new Error('Failed to fetch moon data');
        const data = await response.json();

        fullMoonData = data.days.slice(0, 8); // today + next 7 days
        
        // Initially show only today's moon phase
        displayMoonPhases([fullMoonData[0]], true);
        
        // Show the "Show Next 7 Days" button
        document.getElementById('showMoreContainer').style.display = 'block';
        
    } catch (error) {
        showError(`Error fetching data: ${error.message}`);
    } finally {
        loadingEl.style.display = 'none';
        fetchBtn.disabled = false;
    }
}

function displayMoonPhases(days, showingCurrentOnly = false) {
    const moonPhasesEl = document.getElementById('moonPhases');
    moonPhasesEl.innerHTML = '';

    days.forEach((day, index) => {
        const dayCard = document.createElement('div');
        const isCurrentDay = showingCurrentOnly || index === 0;
        dayCard.className = `phase-card ${isCurrentDay ? 'current-day' : ''}`;

        const moonPhase = parseFloat(day.moonphase);
        const phaseName = MoonPhaseAPI.getMoonPhaseName(moonPhase);
        const phaseDescription = MoonPhaseAPI.getMoonPhaseDescription(moonPhase);
        const clipPath = MoonPhaseAPI.createMoonVisual(moonPhase);

        dayCard.innerHTML = `
            <div class="card-header">
                <div class="date-info">
                    <div class="date-main">${MoonPhaseAPI.formatDate(day.datetime)}</div>
                    <div class="date-sub">${day.datetime}</div>
                </div>
                <div class="illumination-badge">
                    ${(moonPhase * 100).toFixed(0)}%
                </div>
            </div>
            
            <div class="moon-display">
                <div class="moon-container">
                    <div class="moon-visual">
                        <div class="moon-illuminated" style="clip-path: ${clipPath};"></div>
                    </div>
                    <div class="moon-glow"></div>
                </div>
                <div class="phase-info">
                    <h3 class="phase-title">${phaseName}</h3>
                    <p class="phase-description">${phaseDescription}</p>
                </div>
            </div>
            
            <div class="card-footer">
                <div class="time-info">
                    <div class="time-item">
                        <span class="time-label">🌅 Sunrise</span>
                        <span class="time-value">${day.sunrise ? MoonPhaseAPI.formatTime(day.sunrise) : 'N/A'}</span>
                    </div>
                    <div class="time-item">
                        <span class="time-label">🌇 Sunset</span>
                        <span class="time-value">${day.sunset ? MoonPhaseAPI.formatTime(day.sunset) : 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;

        moonPhasesEl.appendChild(dayCard);
    });
}

function showNext7Days() {
    // Show all 8 days (today + next 7)
    displayMoonPhases(fullMoonData);
    
    // Hide the "Show Next 7 Days" button
    document.getElementById('showMoreContainer').style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Allow Enter key to trigger fetch
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchMoonPhases();
        }
    });
});
