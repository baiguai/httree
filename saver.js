import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

/*

INSTALLATION:

Copy this file to the directory where your notes will be.
Run the following:

npm install express
npm install body-parser
npm install cors

Copy over your Httree notes file.
In the saver.js file, there's an IP value - set your notes' nodeIp to that.
In the saver.js file, set the fileName to your notes file name minus the extension.


If you have multiple notes there, give your saver.js unique names
and configure the file name and IP to be unique in each.

To run your savers, use:

node saver.js

Then simply open your notes .html file - to save use the key binding: n

*/


const fileName = "httree_help";
const nodeIp = 3000;





const app = express();
app.use(bodyParser.text({ limit: "5000mb" }));

// Manual CORS handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const FILE_PATH = path.resolve("./"+fileName+".html");

app.post("/save", (req, res) => {
  const content = req.body;
  if (!content) {
    return res.status(400).send("No content received");
  }

  fs.writeFile(FILE_PATH, content, "utf8", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving file");
    }
    console.log(`File saved to ${FILE_PATH}`);
    res.send("File saved successfully");
  });
});

app.listen(nodeIp, () => {
  console.log("Saver running at http://localhost:"+nodeIp);
});
