// Endpoint URL for your backend service
const backendUrl = 'https://skochar1-github-io.vercel.app/';

async function fetchAndInitializeQuizzes() {
    try {
        const response = await fetch(`${backendUrl}/quizzes`);
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const quizzes = await response.json();

        if (!localStorage.getItem('quizzes')) {
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            localStorage.setItem('unselectedQuizzes', JSON.stringify(quizzes.map(quiz => quiz['Quiz Name'])));
        }
    } catch (error) {
        console.error('Error fetching quizzes from backend:', error);
    }
}

async function goToRandomQuizUrl() {
    let quizzes = JSON.parse(localStorage.getItem('quizzes'));
    let unselectedQuizzes = JSON.parse(localStorage.getItem('unselectedQuizzes'));
    
    if (unselectedQuizzes.length === 0) {
        unselectedQuizzes = quizzes.map(quiz => quiz['Quiz Name']);
    }

    const randomQuizName = unselectedQuizzes[Math.floor(Math.random() * unselectedQuizzes.length)];
    const selectedQuizIndex = quizzes.findIndex(quiz => quiz['Quiz Name'] === randomQuizName);
    
    if (selectedQuizIndex !== -1) {
        // Increment the count for the selected quiz
        quizzes[selectedQuizIndex].Count += 1;
        // Remove the selected quiz from unselectedQuizzes
        unselectedQuizzes = unselectedQuizzes.filter(name => name !== randomQuizName);

        // Update local storage
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        localStorage.setItem('unselectedQuizzes', JSON.stringify(unselectedQuizzes));

        // Send the updated quizzes back to the backend
        await fetch(`${backendUrl}/update-quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizzes),
        });

        // Redirect to the selected quiz URL
        window.location.href = quizzes[selectedQuizIndex].URL;
    } else {
        console.error('Selected quiz not found');
    }
}

window.onload = async () => {
    await fetchAndInitializeQuizzes();
};
