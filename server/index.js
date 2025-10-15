import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


// In-memory history array
const history = [];



app.post('/api/calculate', (req, res) => {
  const { expression } = req.body;
  try {
    // Evaluate the expression safely (basic, for demo only)
    // Only allow numbers and + - * /
    if (!/^[-+*/0-9. ()]+$/.test(expression)) {
      return res.status(400).json({ error: 'Invalid expression' });
    }
    // eslint-disable-next-line no-eval
    const result = eval(expression);
    // Store in memory (keep last 10)
    history.unshift({ expression, result, createdAt: new Date() });
    if (history.length > 10) history.pop();
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: 'Error evaluating expression' });
  }
});

app.get('/api/history', (req, res) => {
  res.json(history);
});

// Serve static assets from the built client inside server/public
const clientBuildPath = path.join(__dirname, 'public');
app.use(express.static(clientBuildPath));

// SPA fallback - serve index.html for any unknown route (except /api)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
