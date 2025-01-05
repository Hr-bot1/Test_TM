// Function to generate a temporary email address
function generateTempEmail() {
  const url = "https://www.1secmail.com/api/v1/";
  const params = {
    action: "genRandomMailbox",
    count: "1"
  };

  const headers = {
    'User-Agent': "okhttp/3.9.1",
    'Accept-Encoding': "gzip"
  };

  // Make the request to get a random email address
  fetch(url + "?" + new URLSearchParams(params), {
    method: 'GET',
    headers: headers
  })
    .then(response => response.json())
    .then(data => {
      if (data && data[0]) {
        const email = data[0];
        const emailAddress = `${email.mailbox}@${email.domain}`;
        
        // Display the generated email address in the input field
        document.getElementById('tempEmail').value = emailAddress;

        // Save the username and domain to fetch messages later
        const [name, dom] = emailAddress.split('@');
        
        // Fetch emails for this temporary email address
        fetchEmails(name, dom);
      } else {
        alert('Error: Unable to generate temporary email address.');
      }
    })
    .catch(error => {
      console.error('Error generating temporary email:', error);
      alert('Error generating temporary email address. Please try again later.');
    });
}

// Function to fetch emails for the generated temporary email address
function fetchEmails(name, dom) {
  const url = "https://www.1secmail.com/api/v1/";
  const params = {
    action: "getMessages",
    login: name,
    domain: dom
  };

  const headers = {
    'User-Agent': "okhttp/3.9.1",
    'Accept-Encoding': "gzip"
  };

  // Fetch emails for the generated temporary email address
  fetch(url + "?" + new URLSearchParams(params), {
    method: 'GET',
    headers: headers
  })
    .then(response => response.json())
    .then(data => {
      const emailListItems = document.getElementById('emailListItems');
      emailListItems.innerHTML = ''; // Clear the current list

      if (data && data.length > 0) {
        data.forEach(email => {
          const li = document.createElement('li');
          li.textContent = `Subject: ${email.subject} | From: ${email.from}`;
          li.addEventListener('click', function() {
            showEmailDetails(email);
          });
          emailListItems.appendChild(li);
        });
      } else {
        emailListItems.innerHTML = '<li>No emails received yet.</li>';
      }
    })
    .catch(error => {
      console.error('Error fetching emails:', error);
      alert('Error fetching emails. Please try again later.');
    });
}

// Function to display email details
function showEmailDetails(email) {
  document.getElementById('emailSubject').textContent = `Subject: ${email.subject}`;
  document.getElementById('emailFrom').textContent = email.from;
  document.getElementById('emailBody').textContent = email.text;
  document.getElementById('emailDetails').style.display = 'block';
}