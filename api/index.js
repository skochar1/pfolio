const express = require('express');
const axios = require('axios');
const cors = require('cors');
// Use CORS middleware to allow requests from any origin
app.use(cors({
    origin: 'https://skochar1.github.io/survey'
  }));
const Buffer = require('buffer').Buffer; // Node.js buffer module for base64 encoding
const app = express();
app.use(express.json());

const token = process.env.GITHUB_TOKEN; // Securely store and use your token
const repoPath = 'skochar1/skochar1.github.io'; // Your GitHub username and repository
const filePath = 'Form_URLs.json'; // Path to your JSON file in the repo

app.post('/update-url', async (req, res) => {
    try {
        // Fetch the current file content from GitHub
        let fileResponse = await axios.get(`https://api.github.com/repos/${repoPath}/contents/${filePath}`, {
            headers: { 'Authorization': `token ${token}` }
        });

        // Assuming req.body contains the updated JSON object
        // Convert the updated JSON object to a string
        const updatedContentStr = JSON.stringify(req.body, null, 2); // null, 2 for pretty formatting

        // Encode the updated content string to base64
        const updatedContentBase64 = Buffer.from(updatedContentStr).toString('base64');

        // Update the file on GitHub
        let updateResponse = await axios.put(`https://api.github.com/repos/${repoPath}/contents/${filePath}`, {
            message: 'Update URL list',
            content: updatedContentBase64,
            sha: fileResponse.data.sha // The blob SHA of the file being replaced
        }, {
            headers: { 'Authorization': `token ${token}` }
        });

        res.json({ success: true, data: updateResponse.data });
    } catch (error) {
        console.error('Failed to update file:', error);
        res.status(500).json({ success: false, error: 'Failed to update file' });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
