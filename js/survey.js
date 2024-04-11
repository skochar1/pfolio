document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('randomQuizButton');
    
    button.addEventListener('click', function() {
        fetch('https://script.google.com/macros/s/AKfycbwgHxqwy-fEp3JtFZ8sg-OdFDC-laH-ZEaKfZt8TJkatDjxCqfdM767uGyh3rWwuZSGkA/exec')
            .then(response => response.text())
            .then(url => {
                // Redirect the user to the fetched URL
                window.location.href = url;
            })
            .catch(error => console.error('Error fetching form URL:', error));
    });
});
