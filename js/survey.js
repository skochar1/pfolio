document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('randomQuizButton');
    
    button.addEventListener('click', function() {
        fetch('https://script.google.com/macros/s/AKfycbzMcVE57VKyY5pZSGbHvbkRMBq8zFI57cGq7POll7_YVSSU5-CETqLCts_Q4u_nkvsFRQ/exec')
            .then(response => response.text())
            .then(url => {
                // Redirect the user to the fetched URL
                window.location.href = url;
            })
            .catch(error => console.error('Error fetching form URL:', error));
    });
});
