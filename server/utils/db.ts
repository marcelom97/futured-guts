import { Client } from "@libsql/client";

let db: Client | null = null;
let isInitialized = false;

export async function getDatabase() {
  if (!db) {
    const { useTurso } = await import("./turso");
    db = useTurso();

    if (!isInitialized) {
      await initializeDatabase(db);
      isInitialized = true;
    }
  }
  return db;
}

async function initializeDatabase(db: Client) {
  // Teachers table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Students table
  await db.execute(`
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
  await db.execute(`
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
  await db.execute(`
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
  await db.execute(`
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
  await db.execute(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    )
  `);

  // Group members table
  await db.execute(`
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
  await db.execute(`
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
  await db.execute(`
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
    const result = await db.execute("SELECT id FROM teachers LIMIT 1");
    if (result.rows.length === 0) {
      const insertResult = await db.execute({
        sql: "INSERT INTO teachers (name, email) VALUES (?, ?)",
        args: ["Demo Teacher", "demo@teacher.com"],
      });
      console.log(
        `Created dummy teacher with ID: ${insertResult.lastInsertRowid}`
      );
    }
  } catch (error) {
    console.log("Teacher creation check failed:", error);
  }
}
