const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./Develop/public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(
    path.join(__dirname, "./Develop/db/db.json"),
    function (error, response) {
      const notes = JSON.parse(response);
      console.log(notes);
      res.json(notes);
    }
  );
});

app.post("/api/notes", function (req, res) {
  fs.readFile(
    path.join(__dirname, "./Develop/db/db.json"),
    function (error, response) {
      const notes = JSON.parse(response);
      const noteRequest = req.body;
      const newNoteID = notes.length + 1;
      const newNote = {
        id: newNoteID,
        title: noteRequest.title,
        text: noteRequest.text,
      };
      if (error) {
        console.log(error);
      }
      notes.push(newNote);
      res.json(newNote);
      fs.writeFile(
        path.join(__dirname, "./Develop/db/db.json"),
        JSON.stringify(notes, null, 2),
        function (err) {
          if (err) throw err;
        }
      );
    }
  );
});

app.delete("/api/notes/:id", (req, res) => {
  const ID = parseInt(req.params.id);
  console.log("console log id =", ID);
  fs.readFile(path.join(__dirname, "/db/db.json"), function (error, response) {
    if (error) {
      console.log(error);
    }
    const notes = JSON.parse(response);
    console.log("console log notes = ", notes);
    const newNotesArray = notes.filter((item) => {
      return item.id !== ID;
    });
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(newNotesArray, null, 2),
      function (err) {
        if (err) throw err;
        res.end();
      }
    );
  });
});
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
