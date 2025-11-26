// Initialize form elements
const form = document.querySelector('form');
const pickupInput = document.querySelector('#pickup');
const dropoffInput = document.querySelector('#dropoff');
const vehicleSelect = document.querySelector('#vehicle');
const estimateBtn = document.querySelector('#estimate');
const resultDiv = document.querySelector('#result');

// Event listener for form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pickup = pickupInput.value;
  const dropoff = dropoffInput.value;
  const vehicle = vehicleSelect.value;
  
  // Call API to get fare estimate
  const fare = await getFareEstimate(pickup, dropoff, vehicle);
  
  // Display result
  resultDiv.innerHTML = `Estimated fare: $${fare}`;
});

// Function to get fare estimate from API
async function getFareEstimate(pickup, dropoff, vehicle) {
  // TODO: Implement API call
  return 25; // Placeholder value
}