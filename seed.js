import Database from 'better-sqlite3';
import fs from 'fs';

console.log("Seeding SQLite database...");

const dbFile = 'civiclens.db';
const db = new Database(dbFile);

db.exec(`
  DROP TABLE IF EXISTS complaints;
  DROP TABLE IF EXISTS emergencies;
  DROP TABLE IF EXISTS workers;
  DROP TABLE IF EXISTS departments;
  DROP TABLE IF EXISTS users;
`);

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT NOT NULL
  );

  CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    location_lat REAL NOT NULL,
    location_lng REAL NOT NULL,
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  CREATE TABLE complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    severity TEXT NOT NULL,
    summary TEXT NOT NULL,
    status TEXT NOT NULL,
    department TEXT NOT NULL,
    estimated_resolution_time TEXT NOT NULL,
    worker_id INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
  );

  CREATE TABLE emergencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    severity TEXT NOT NULL,
    reported_at TEXT NOT NULL
  );
`);

// Insert Users
const insertUser = db.prepare('INSERT INTO users (name, email, role, avatar) VALUES (?, ?, ?, ?)');
insertUser.run("Priya Sharma", "priya@example.com", "CITIZEN", "https://i.pravatar.cc/150?u=jane");
insertUser.run("BMC Control Center", "operator@bmc.gov.in", "OPERATOR", "https://i.pravatar.cc/150?u=admin");
insertUser.run("Rahul Verma", "rahul.worker@bmc.gov.in", "WORKER", "https://i.pravatar.cc/150?u=mike");

// Insert Departments
const insertDept = db.prepare('INSERT INTO departments (name, description) VALUES (?, ?)');
insertDept.run("BMC Public Works", "Roads, infrastructure, and public spaces");
insertDept.run("BMC Solid Waste Management", "Waste management and city cleanliness");
insertDept.run("Mumbai Traffic Police", "Emergency services and law enforcement");
insertDept.run("BMC Water Supply", "Utility management and repairs");

// Insert Workers
const insertWorker = db.prepare('INSERT INTO workers (name, status, department_id, location_lat, location_lng) VALUES (?, ?, ?, ?, ?)');
insertWorker.run("Rahul Verma", "Active", 1, 19.0760, 72.8777);
insertWorker.run("Anjali Desai", "Busy", 3, 19.0822, 72.8850);
insertWorker.run("Vikram Singh", "Inactive", 2, 19.0700, 72.8710);
insertWorker.run("Neha Patel", "Active", 4, 19.0900, 72.8600);
insertWorker.run("Rajesh Kumar", "Busy", 3, 19.0600, 72.8800);
insertWorker.run("Sanjay Gupta", "Active", 1, 19.0650, 72.8700);

// Insert Complaints
const insertComplaint = db.prepare('INSERT INTO complaints (category, priority, severity, summary, status, department, estimated_resolution_time, worker_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

const categories = ["infrastructure", "water", "sanitation", "power", "environmental", "safety"];
const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = ["Pending", "In Progress", "Resolved", "Closed"];
const depts = ["BMC Public Works", "BMC Water Supply", "BMC Solid Waste Management", "BMC Water Supply", "BMC Solid Waste Management", "Mumbai Traffic Police"];

// Seed 30 complaints
for (let i = 1; i <= 30; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const prio = priorities[Math.floor(Math.random() * priorities.length)];
  const stat = statuses[Math.floor(Math.random() * statuses.length)];
  
  let summary = "";
  if (cat === "infrastructure") summary = `Pothole reported on street ${i}`;
  else if (cat === "water") summary = `Water leak at building ${i}`;
  else if (cat === "sanitation") summary = `Overflowing trash bins at sector ${i}`;
  else if (cat === "power") summary = `Streetlight out on avenue ${i}`;
  else if (cat === "environmental") summary = `Excessive noise/pollution in zone ${i}`;
  else summary = `Safety hazard near park ${i}`;
  
  const dept = depts[categories.indexOf(cat)];
  const estTime = `${Math.floor(Math.random() * 48) + 2} Hours`;
  const worker_id = Math.random() > 0.5 ? Math.floor(Math.random() * 6) + 1 : null;
  const createdAt = new Date(Date.now() - Math.random() * 864000000).toISOString();
  
  insertComplaint.run(cat, prio, prio, summary, stat, dept, estTime, worker_id, createdAt);
}

// Insert Emergencies
const insertEmergency = db.prepare('INSERT INTO emergencies (type, location, status, severity, reported_at) VALUES (?, ?, ?, ?, ?)');
insertEmergency.run("Medical", "CSMT Terminus", "Active", "Critical", new Date().toISOString());
insertEmergency.run("Fire", "Bandra Kurla Complex", "Active", "Critical", new Date(Date.now() - 3600000).toISOString());
insertEmergency.run("Traffic Accident", "Western Express Highway", "Resolved", "High", new Date(Date.now() - 8640000).toISOString());

console.log("Database seeded successfully with rich prototype data.");
db.close();
