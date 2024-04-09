const jsonFilePath = './Form_URLs.json';

async function fetchAndInitializeQuizzes() {
    if (!localStorage.getItem('quizzes') || !localStorage.getItem('unselectedQuizzes')) {
        try {
            const response = await fetch(jsonFilePath);
            const quizzes = await response.json();
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            localStorage.setItem('unselectedQuizzes', JSON.stringify(quizzes));
        } catch (error) {
            console.error('Error fetching the JSON file:', error);
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

    // Redirect the user to the selected quiz URL
    window.location.href = selectedQuiz.URL;
}

window.onload = async () => {
    await fetchAndInitializeQuizzes();
};
