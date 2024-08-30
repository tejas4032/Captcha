// Initialize variables to store user behavior data
let mouseMovements = [];
let typingData = [];

// Track mouse movement
document.addEventListener('mousemove', function(event) {
    let timestamp = Date.now();
    mouseMovements.push({
        x: event.clientX,
        y: event.clientY,
        time: timestamp
    });
});

// Track typing speed
document.addEventListener('keydown', function(event) {
    let timestamp = Date.now();
    typingData.push({
        key: event.key,
        time: timestamp
    });
});

// Ensure the code runs only after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission
    document.getElementById('statusForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the usual way

        // Prepare data to send to the server
        let behaviorData = {
            mouseMovements: mouseMovements,
            typingData: typingData
        };

        console.log('Behavior Data:', behaviorData); // Log behavior data

        // Send the data to the server
        fetch('http://localhost:3000/verify', { // Updated to correct port 3000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(behaviorData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data); // Log server response

            if (data.verified) {
                // CAPTCHA passed
                alert('CAPTCHA passed! You are a human.');

                // Proceed to check status after CAPTCHA is verified
                const formData = new FormData(document.getElementById('statusForm'));
                const query = new URLSearchParams({
                    idType: formData.get('idType'),
                    enrolmentId: formData.get('enrolmentId'),
                }).toString();

                // Fetch the status from the server
                fetch(`/api/status/check?${query}`)
                    .then(response => response.json())
                    .then(result => {
                        console.log('GET Response:', result); // Log the result for debugging

                        // Display the response in the HTML
                        document.getElementById('responseContent').textContent = JSON.stringify(result, null, 2);
                    })
                    .catch(error => {
                        console.error('Error:', error); // Log any errors
                        document.getElementById('responseContent').textContent = 'Error fetching status. Please try again.';
                    });
            } else {
                // CAPTCHA failed
                alert('CAPTCHA failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});
