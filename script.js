/**
 * Lab 5 - Patient Database Client
 * Team: v6
 * Attribution: ChatGPT (https://chat.openai.com/) was used for code structure assistance.
 */

// Environment detection
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';

// API Configuration
const API_CONFIG = {
  local: 'http://localhost:3030/api/v1/sql',
  production: 'http://159.203.41.108:3030/api/v1/sql'
};

const API_BASE_URL = isLocal ? API_CONFIG.local : API_CONFIG.production;

// User-facing strings
const MESSAGES = {
  INSERTING: 'Inserting patients...',
  EXECUTING: 'Executing query...',
  SUCCESS: 'Success!',
  ERROR: 'Error occurred'
};

// Sample data
const SAMPLE_PATIENTS = [
  { name: 'Sara Brown', dob: '1901-01-01' },
  { name: 'John Smith', dob: '1941-01-01' },
  { name: 'Jack Ma', dob: '1961-01-30' },
  { name: 'Elon Musk', dob: '1999-01-01' }
];

// Insert button handler
document.getElementById('insertBtn').addEventListener('click', async () => {
  const responseDiv = document.getElementById('insertResponse');
  responseDiv.textContent = MESSAGES.INSERTING;
  
  try {
    for (const patient of SAMPLE_PATIENTS) {
      const query = `INSERT INTO patient (name, dateOfBirth) VALUES ('${patient.name}', '${patient.dob}')`;
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    }
    responseDiv.textContent = MESSAGES.SUCCESS;
  } catch (error) {
    responseDiv.textContent = `${MESSAGES.ERROR}: ${error.message}`;
  }
});

// Query submit handler
document.getElementById('submitBtn').addEventListener('click', async () => {
  const query = document.getElementById('queryInput').value.trim();
  const responseDiv = document.getElementById('queryResponse');
  
  if (!query) {
    responseDiv.textContent = 'Please enter a query';
    return;
  }
  
  responseDiv.textContent = MESSAGES.EXECUTING;
  
  try {
    const isSelect = query.toUpperCase().startsWith('SELECT');
    let response;
    
    if (isSelect) {
      const encodedQuery = encodeURIComponent(query);
      response = await fetch(`${API_BASE_URL}/${encodedQuery}`);
    } else {
      response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
    }
    
    const result = await response.json();
    if (result.success) {
      responseDiv.textContent = JSON.stringify(result.data, null, 2);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    responseDiv.textContent = `${MESSAGES.ERROR}: ${error.message}`;
  }
});