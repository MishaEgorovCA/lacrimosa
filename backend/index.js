const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("surveys.db");

app.use(express.json());

app.post("/get-message", (req, res) => {
  const { code } = req.body;
  db.get("SELECT message, username FROM surveys WHERE code = ?", [code], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Invalid code" });
    res.json({ name: row.username, message: row.message });
  });
});

app.post("/save-response", (req, res) => {
  const { code, response } = req.body;
  db.run("UPDATE surveys SET response = ? WHERE code = ?", [JSON.stringify(response), code], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


//Admin commands
app.use('/admin/{*splat}', (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token || !token.length || token.length < 3 || token[2] !== 'd' && token[token.length - 3] !== 'n') { //insecure!!! must change to smth like token !== process.env.ADMIN_TOKEN 
        return res.status(401).json({ error: 'Invalid admin token' });
    }
    
    next();
});



app.post("/admin/add-survey", (req, res) => {
  const { code, username, message } = req.body;
  db.run("INSERT INTO surveys (code, username, message) VALUES (?, ?, ?)", [code, username, message], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

function generateUniqueCode() {
    const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
    return new Promise((resolve, reject) => {
        const tryCode = () => {
            const code = generateCode();
            db.get("SELECT 1 FROM surveys WHERE code = ?", [code], (err, row) => {
                if (err) return reject(err);
                if (row) return tryCode();
                resolve(code);
            });
        };
        tryCode();
    });
}

app.post("/admin/generate-unique-code", async (req, res) => {
    try {
        const uniqueCode = await generateUniqueCode();
        res.json({ code: uniqueCode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/admin/remove-survey", (req, res) => {
    const { code } = req.body;
    db.run("DELETE FROM surveys WHERE code = ?", [code], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post("/admin/list-responses", (req, res) => {
    db.all("SELECT code, username, message, response FROM surveys", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));