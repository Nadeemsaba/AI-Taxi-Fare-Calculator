// Initialize chatbot elements
async function calculateFare() {
  const { pickup, dropoff, vehicle, time } = userInputs;
  chatBody.innerHTML += `<div class='bot-message'>Calculating fare using AI...</div>`;
  const fare = await estimateFareWithGemini(pickup, dropoff, vehicle, time);
  chatBody.innerHTML += `<div class='bot-message'>Estimated fare: $${fare.toFixed(2)}</div>`;
  currentStep = 0;
  userInputs = {};
  askNextQuestion();
}

let currentStep = 0;
const steps = ['pickup', 'dropoff', 'vehicle', 'time'];
const userInputs = {};

function askNextQuestion() {
  if (currentStep >= steps.length) {
    // All questions answered
    chatBody.innerHTML += `<div class='bot-message'>Calculating fare...</div>`;
    calculateFare();
    return;
  }

  const currentQuestion = steps[currentStep];
  let questionText = '';

  switch(currentQuestion) {
    case 'pickup':
      questionText = 'Please enter your pickup location:';
      break;
    case 'dropoff':
      questionText = 'Please enter your dropoff location:';
      break;
    case 'vehicle':
      questionText = 'Please select vehicle type (mini/sedan/suv):';
      break;
    case 'time':
      questionText = 'Please enter travel time (HH:MM):';
      break;
  }

  chatBody.innerHTML += `<div class='bot-message'>${questionText}</div>`;
  chatInput.value = '';
  chatInput.focus();
}
const chatButton = document.createElement('button');
chatButton.id = 'chat-button';
chatButton.innerHTML = 'Chat';
chatButton.style.position = 'fixed';
chatButton.style.bottom = '20px';
chatButton.style.right = '20px';
chatButton.style.padding = '10px 20px';
chatButton.style.backgroundColor = '#4f46e5';
chatButton.style.color = 'white';
chatButton.style.border = 'none';
chatButton.style.borderRadius = '5px';
chatButton.style.cursor = 'pointer';

document.body.appendChild(chatButton);

// Chat window container
const chatWindow = document.createElement('div');
chatWindow.id = 'chat-window';
chatWindow.style.position = 'fixed';
chatWindow.style.bottom = '80px';
chatWindow.style.right = '20px';
chatWindow.style.width = '300px';
chatWindow.style.height = '400px';
chatWindow.style.backgroundColor = 'white';
chatWindow.style.borderRadius = '5px';
chatWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
chatWindow.style.display = 'none';

// Chat header
const chatHeader = document.createElement('div');
chatHeader.style.padding = '10px';
chatHeader.style.backgroundColor = '#4f46e5';
chatHeader.style.color = 'white';
chatHeader.style.borderRadius = '5px 5px 0 0';
chatHeader.innerHTML = 'Chat with us,..';

// Chat body
const chatBody = document.createElement('div');
chatBody.id = 'chat-body';
chatBody.style.height = '300px';
chatBody.style.padding = '10px';
chatBody.style.overflowY = 'auto';

// Chat input
const chatInputContainer = document.createElement('div');
chatInputContainer.style.display = 'flex';
chatInputContainer.style.gap = '10px';

const chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.id = 'chat-input';
chatInput.placeholder = 'Type your message...';
chatInput.style.width = '100%';
chatInput.style.padding = '10px';
chatInput.style.border = '1px solid #ccc';
chatInput.style.borderRadius = '5px';

const sendButton = document.createElement('button');
sendButton.id = 'send-button';
sendButton.innerHTML = 'Send';
sendButton.style.padding = '10px 20px';
sendButton.style.backgroundColor = '#4f46e5';
sendButton.style.color = 'white';
sendButton.style.border = 'none';
sendButton.style.borderRadius = '5px';
sendButton.style.cursor = 'pointer';

chatInputContainer.appendChild(chatInput);
chatInputContainer.appendChild(sendButton);

// Append elements
chatWindow.appendChild(chatHeader);
chatWindow.appendChild(chatBody);
chatWindow.appendChild(chatInputContainer);
document.body.appendChild(chatWindow);

// Chatbot functionality
chatButton.addEventListener('click', () => {
  chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
  if (chatWindow.style.display === 'block') {
    showWelcomeMessage();
  }
});

// Show welcome message
function showWelcomeMessage() {
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'chat-message';
  welcomeMsg.innerHTML = 'Welcome! Please enter your pickup location.';
  chatBody.appendChild(welcomeMsg);
}

// Handle chat input
chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    await handleMessageSend();
  }
});

sendButton.addEventListener('click', async () => {
  await handleMessageSend();
});

async function handleMessageSend() {
  const userInput = chatInput.value.trim();
  if (userInput) {
    addUserMessage(userInput);
    chatInput.value = '';
    await processUserInput(userInput);
  }
}

// Add user message to chat
function addUserMessage(message) {
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user-message';
  userMsg.innerHTML = message;
  chatBody.appendChild(userMsg);
}

// Process user input
async function processUserInput(input) {
  const currentQuestion = steps[currentStep];
  userInputs[currentQuestion] = input;

  // Add user's message to chat
  chatBody.innerHTML += `<div class='user-message'>${input}</div>`;

  // Validate input based on current step
  let isValid = true;
  let errorMessage = '';

  switch(currentQuestion) {
    case 'pickup':
    case 'dropoff':
      if (input.length < 3) {
        isValid = false;
        errorMessage = 'Please enter a valid location (at least 3 characters)';
      }
      break;
    case 'vehicle':
      if (!['mini', 'sedan', 'suv'].includes(input.toLowerCase())) {
        isValid = false;
        errorMessage = 'Please select a valid vehicle type (mini/sedan/suv)';
      }
      break;
    case 'time':
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(input)) {
        isValid = false;
        errorMessage = 'Please enter a valid time in HH:MM format';
      }
      break;
  }

  if (!isValid) {
    chatBody.innerHTML += `<div class='bot-message'>${errorMessage}</div>`;
    return;
  }

  currentStep++;
  if (currentStep < steps.length) {
    askNextQuestion();
  } else {
    calculateFare();
  }
}