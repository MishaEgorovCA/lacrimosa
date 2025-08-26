// init_db.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("surveys.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS surveys (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE, username TEXT, message TEXT, response JSON DEFAULT NULL)");

  // Insert a couple test rows
  const stmt = db.prepare("INSERT OR IGNORE INTO surveys (code, username, message) VALUES (?, ?, ?)");
  stmt.run("123456", "user1", "Test");
  stmt.run("000000", "Zbigniew", "I think you have a strong sense for things that matter to me: quality, attention to detail, and design sensibility. I kindly ask you to take a few moments to answer the following questions. Your honest feedback is incredibly valuable and will help shape and improve what I'm creating. Every response counts, and your thoughtful input is greatly appreciated.\n\nThank you for your time.\n\n— David");
  stmt.finalize();
});

db.close();
console.log("Database initialized!");