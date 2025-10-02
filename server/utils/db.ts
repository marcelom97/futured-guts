import Database from "better-sqlite3";
import { join } from "path";

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = join(process.cwd(), "data", "app.db");
    db = new Database(dbPath);
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  // Teachers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      teacher_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
  `);

  // Questionnaires table
  db.exec(`
    CREATE TABLE IF NOT EXISTS questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
  `);

  // Questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      question_type TEXT NOT NULL, -- 'scale', 'multiple_choice', 'text'
      category TEXT NOT NULL, -- 'behavioral' or 'hard_skill'
      trait TEXT NOT NULL, -- e.g., 'teamwork', 'leadership', 'math', 'writing'
      weight REAL DEFAULT 1.0,
      options TEXT, -- JSON array for multiple choice
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    )
  `);

  // Student responses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      response_value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (question_id) REFERENCES questions(id),
      UNIQUE(student_id, question_id)
    )
  `);

  // Groups table
  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    )
  `);

  // Group members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS group_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(id),
      FOREIGN KEY (student_id) REFERENCES students(id),
      UNIQUE(group_id, student_id)
    )
  `);

  // Trait weights table (for customizable grouping criteria)
  db.exec(`
    CREATE TABLE IF NOT EXISTS trait_weights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL,
      trait TEXT NOT NULL,
      weight REAL DEFAULT 1.0,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id),
      UNIQUE(questionnaire_id, trait)
    )
  `);

  // Grouping metadata table (stores AI analysis for groups)
  db.exec(`
    CREATE TABLE IF NOT EXISTS grouping_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL UNIQUE,
      balance_score REAL,
      diversity_explanation TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    )
  `);

  // Insert dummy teacher if none exists
  try {
    const existingTeacher = db.prepare("SELECT id FROM teachers LIMIT 1").get();
    if (!existingTeacher) {
      const stmt = db.prepare(`
        INSERT INTO teachers (name, email) 
        VALUES (?, ?)
      `);
      const result = stmt.run("Demo Teacher", "demo@teacher.com");
      console.log(`Created dummy teacher with ID: ${result.lastInsertRowid}`);
    }
  } catch (error) {
    console.log("Teacher creation check failed:", error);
  }
}
