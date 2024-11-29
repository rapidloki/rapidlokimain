const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload File Route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.redirect("/");
});

// API to get list of uploaded files
app.get("/files", (req, res) => {
    fs.readdir("./uploads", (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Failed to list files." });
        }
        res.json(files);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`RapidLoki running on http://localhost:${PORT}`);
});

