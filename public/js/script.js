
function getCurrentDateTime() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const date = now.toLocaleDateString('en-US', options);
    const time = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
    return { date, time };
  }
  
  // Display the current date and time
  function displayCurrentDateTime() {
    const { date, time } = getCurrentDateTime();
    document.getElementById('current-date').textContent = date;
    document.getElementById('current-time').textContent = time;
  }
  
  // Update the current date and time every second
  setInterval(displayCurrentDateTime, 1000);