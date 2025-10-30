// =========================================================================== Httree Saver Server
//  Simple local Node.js server that saves and auto-backs up your editor.html
// ===========================================================================


/*

INSTALLATION:

Copy this file to the directory where your notes will be.
Run the following:

sudo npm install -g express
sudo npm install -g body-parser
sudo npm install -g cors

NOTE:
You may STILL need to run:
npm install express
the first time you copy the saver (which you can rename of course) to a new directory.

Copy over your Httree notes file (rename it as desired).
Below: Set the FILE_PATH, PORT, and if needed NODE_IP


If you have multiple notes there, give your saver.js unique names
and configure the file name and IP to be unique in each.

To run your savers, use:

node saver.js

Then simply open your notes .html file - to save use the key binding: n

*/



//  USER SETTINGS – easy to edit
// ---------------------------------------------------------------------------



// Path to the HTML file you want to save
const FILE_PATH = "./httree.html";
const NODE_IP = "localhost";  // or your LAN IP
const PORT = 3000;

// Backup behavior
const BACKUP_DIR = "./backups";   // where backups go
const MAX_BACKUPS = 200;          // how many to keep (-1 = disabled, 0 = unlimited)
const MAX_DAYS = 0;               // delete backups older than N days (0 = keep forever)





// ---------------------------------------------------------------------------
//  (you generally don’t need to edit below this line)
// ---------------------------------------------------------------------------

import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.text({ limit: "50mb" }));

const resolvedFile = path.resolve(FILE_PATH);
const resolvedBackupDir = path.resolve(BACKUP_DIR);
if (!fs.existsSync(resolvedBackupDir)) fs.mkdirSync(resolvedBackupDir, { recursive: true });

// --- Basic CORS for browser requests ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// --- Save Route ---
app.post("/save", (req, res) => {
  const content = req.body;
  if (!content) return res.status(400).send("No content received");

  try {
    // --- Create a backup first ---
    if (MAX_BACKUPS > -1) {
      if (fs.existsSync(resolvedFile)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupPath = path.join(
          resolvedBackupDir,
          `${path.basename(resolvedFile, ".html")}_${timestamp}.html`
        );
        fs.copyFileSync(resolvedFile, backupPath);
        console.log(`🗂️  Backup created: ${backupPath}`);
      }
    }

    // --- Write the new file ---
    fs.writeFileSync(resolvedFile, content, "utf8");
    console.log(`✅ File saved: ${resolvedFile}`);

    pruneBackups();
    res.send("File saved successfully");
  } catch (err) {
    console.error("❌ Error saving:", err);
    res.status(500).send("Error saving file");
  }
});

// --- Cleanup function ---
function pruneBackups() {
  try {
    const files = fs
      .readdirSync(resolvedBackupDir)
      .filter(f => f.endsWith(".html"))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(resolvedBackupDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // newest first

    if (MAX_BACKUPS > 0 && files.length > MAX_BACKUPS) {
      const toDelete = files.slice(MAX_BACKUPS);
      for (const f of toDelete)
        fs.unlinkSync(path.join(resolvedBackupDir, f.name));
      console.log(`🧹 Deleted ${toDelete.length} old backups`);
    }

    if (MAX_DAYS > 0) {
      const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000;
      for (const f of files)
        if (f.time < cutoff)
          fs.unlinkSync(path.join(resolvedBackupDir, f.name));
    }
  } catch (err) {
    console.error("⚠️  Error pruning backups:", err);
  }
}

// --- Start server ---
app.listen(PORT, NODE_IP, () => {
  console.log(`💾 Saver running at http://${NODE_IP}:${PORT}`);
});
