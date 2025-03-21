// Function to generate a temporary email address
function generateTempEmail() {
  const url = "https://api.internal.temp-mail.io/api/v3/email/new";
  const params = {
    'action': 'genRandomMailbox',
    'count': '1'
  };

  // Make the request to generate a new email
  fetch(url + "?" + new URLSearchParams(params), {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);

      if (data && data[0]) {
        const email = data[0];

        // Display the generated email address in the input field
        document.getElementById('tempEmail').value = email;

        // Save the username and domain to fetch messages later
        const [name, dom] = email.split('@');

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
    'action': 'getMessages',
    'login': name,
    'domain': dom
  };

  // Make the request to fetch emails
  fetch(url + "?" + new URLSearchParams(params), {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched Emails:', data);

      const emailListItems = document.getElementById('emailListItems');
      emailListItems.innerHTML = ''; // Clear the current list

      if (data && Array.isArray(data) && data.length > 0) {
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
