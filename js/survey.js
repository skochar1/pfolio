// Endpoint URL for your backend service
const backendUrl = 'https://skochar1-github-io.vercel.app/';

const jsonFilePath = 'Form_URLs.json';

async function fetchAndInitializeQuizzes() {
    if (!localStorage.getItem('quizzes') || !localStorage.getItem('unselectedQuizzes')) {
        try {
            // Fetch quizzes directly from the same directory
            const response = await fetch(jsonFilePath);
            if (!response.ok) throw new Error('Failed to fetch quizzes');
            const quizzes = await response.json();

            // Store quizzes in localStorage for managing selections without repeats
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            localStorage.setItem('unselectedQuizzes', JSON.stringify(quizzes.map(quiz => quiz['Quiz Name'])));
        } catch (error) {
            console.error('Error fetching quizzes from JSON file:', error);
        }
    }
}

async function selectAndUpdateQuiz() {
    let quizzes = JSON.parse(localStorage.getItem('quizzes'));
    let minCount = Math.min(...quizzes.map(quiz => quiz.Count));
    let candidates = quizzes.filter(quiz => quiz.Count === minCount);
    
    let selectedQuiz = candidates[Math.floor(Math.random() * candidates.length)];
    selectedQuiz.Count += 1; // Increment count
    
    // Update local storage
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    // Send updated data back to backend
    try {
        const response = await fetch(`${backendUrl}update-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizzes)
        });
        
        if (!response.ok) throw new Error('Failed to update quizzes');
        
        // Redirect to the selected quiz URL
        window.location.href = selectedQuiz.URL;
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('randomQuizButton').addEventListener('click', selectAndUpdateQuiz);

window.onload = () => {
    fetchAndInitializeQuizzes();
};