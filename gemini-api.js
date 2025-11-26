// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyCnofR57PFZ7BSMsXZ6b7uG_F8l4d0x1u0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Function to estimate fare using Gemini API
async function estimateFareWithGemini(pickup, dropoff, vehicle, time) {
  try {
    const prompt = `Calculate ride fare estimation with the following details:\n
Pickup: ${pickup}\nDropoff: ${dropoff}\nVehicle Type: ${vehicle}\nTime: ${time}\n\nProvide only the estimated fare as a number in USD.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get fare estimation');
    }

    const data = await response.json();
    const fareText = data.candidates[0].content.parts[0].text;
    const fare = parseFloat(fareText.match(/\d+(\.\d+)?/)[0]);
    return fare;
  } catch (error) {
    console.error('Error estimating fare:', error);
    return 25; // Default fallback fare
  }
}