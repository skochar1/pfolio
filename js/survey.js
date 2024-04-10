// Endpoint URL for your backend service
// Replace this URL with the actual URL of your deployed backend
const backendUrl = 'https://thesis-survey-stack.vercel.app/';

async function fetchAndInitializeQuizzes() {
    if (!localStorage.getItem('quizzes') || !localStorage.getItem('unselectedQuizzes')) {
        try {
            // Fetch quizzes from the backend instead of a local JSON file
            const response = await fetch(`${backendUrl}/quizzes`);
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const quizzes = await response.json();

            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            localStorage.setItem('unselectedQuizzes', JSON.stringify(quizzes));
        } catch (error) {
            console.error('Error fetching quizzes from backend:', error);
        }
    }
}

function goToRandomQuizUrl() {
    let unselectedQuizzes = JSON.parse(localStorage.getItem('unselectedQuizzes'));
    
    if (unselectedQuizzes.length === 0) {
        // Reset the list if all quizzes have been selected
        unselectedQuizzes = JSON.parse(localStorage.getItem('quizzes'));
    }

    // Select and remove a random quiz
    const randomIndex = Math.floor(Math.random() * unselectedQuizzes.length);
    const selectedQuiz = unselectedQuizzes.splice(randomIndex, 1)[0];
    
    // Update the storage to reflect the quiz has been selected
    localStorage.setItem('unselectedQuizzes', JSON.stringify(unselectedQuizzes));

    // Instead of redirecting directly, notify the backend about the selection (optional)
    // This step could be used to update the server-side state or perform logging
    fetch(`${backendUrl}/select-quiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizName: selectedQuiz['Quiz Name'] }),
    })
    .then(response => {
        if (response.ok) {
            // Redirect the user to the selected quiz URL after notifying the backend
            window.location.href = selectedQuiz.URL;
        } else {
            console.error('Failed to update quiz selection on the backend');
        }
    })
    .catch(error => {
        console.error('Error notifying backend about quiz selection:', error);
    });
}

window.onload = async () => {
    await fetchAndInitializeQuizzes();
};
