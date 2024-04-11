import express, { Request, Response, NextFunction } from "express";
import axios from "axios";

const app = express();

// Custom CORS middleware
const customCors = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
};

app.use(customCors);
app.use(express.json());

// Assuming you have the token set in your environment variables
const token: string = process.env.GITHUB_TOKEN!;
const repoPath: string = 'skochar1/skochar1.github.io';
const filePath: string = 'Form_URLs.json';

app.post('/update-url', async (req: Request, res: Response) => {
    try {
        const fileResponse = await axios.get(`https://api.github.com/repos/${repoPath}/contents/${filePath}`, {
            headers: { 'Authorization': `token ${token}` }
        });

        const updatedContentStr: string = JSON.stringify(req.body, null, 2);
        const updatedContentBase64: string = Buffer.from(updatedContentStr).toString('base64');

        const updateResponse = await axios.put(`https://api.github.com/repos/${repoPath}/contents/${filePath}`, {
            message: 'Update URL list',
            content: updatedContentBase64,
            sha: fileResponse.data.sha
        }, {
            headers: { 'Authorization': `token ${token}` }
        });

        res.json({ success: true, data: updateResponse.data });
    } catch (error) {
        console.error('Failed to update file:', error);
        res.status(500).json({ success: false, error: 'Failed to update file' });
    }
});

// This route effectively replaces the "setup code" as it's a simple root path route.
app.get("/", (req: Request, res: Response) => res.send("Express on Vercel"));

// Use process.env.PORT to accommodate the port assignment by Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

export default app;
