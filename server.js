import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new Database('civiclens.db');

// Simulated network delay middleware for realism
app.use((req, res, next) => {
  setTimeout(next, 300);
});

app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/departments', (req, res) => {
  try {
    const depts = db.prepare('SELECT * FROM departments').all();
    res.json(depts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/workers', (req, res) => {
  try {
    const workers = db.prepare(`
      SELECT w.*, d.name as department_name, d.description as department_desc
      FROM workers w
      LEFT JOIN departments d ON w.department_id = d.id
    `).all();
    
    const formattedWorkers = workers.map(w => ({
      ...w,
      department: { id: w.department_id, name: w.department_name, description: w.department_desc }
    }));
    
    res.json(formattedWorkers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/complaints', (req, res) => {
  try {
    const complaints = db.prepare('SELECT * FROM complaints').all();
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/complaints/:id', (req, res) => {
  try {
    const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(req.params.id);
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ error: 'Complaint not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/complaints', (req, res) => {
  try {
    const { category, priority, severity, summary, department, estimated_resolution_time, worker_id } = req.body;
    
    if (!category || !summary) {
      return res.status(400).json({ error: 'Missing required fields: category, summary' });
    }

    const insert = db.prepare('INSERT INTO complaints (category, priority, severity, summary, status, department, estimated_resolution_time, worker_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    
    const result = insert.run(
      category, priority || 'Low', severity || 'Minor', summary, 'Pending', department || 'General', 
      estimated_resolution_time || 'Unknown', worker_id || null, new Date().toISOString()
    );
    
    const newComplaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/complaints/:id', (req, res) => {
  try {
    const { status } = req.query; // Assuming frontend uses query param ?status=Resolved
    if (status) {
      db.prepare('UPDATE complaints SET status = ? WHERE id = ?').run(status, req.params.id);
    }
    const complaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(req.params.id);
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/emergencies', (req, res) => {
  try {
    const emergencies = db.prepare('SELECT * FROM emergencies').all();
    res.json(emergencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/emergencies', (req, res) => {
  try {
    const { type, location, severity } = req.body;
    
    if (!type || !location) {
      return res.status(400).json({ error: 'Missing required fields: type, location' });
    }

    const insert = db.prepare('INSERT INTO emergencies (type, location, status, severity, reported_at) VALUES (?, ?, ?, ?, ?)');
    const result = insert.run(type, location, 'Active', severity || 'Unknown', new Date().toISOString());
    
    const newEmergency = db.prepare('SELECT * FROM emergencies WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newEmergency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`CivicLens API Server running at http://localhost:${port}`);
});
