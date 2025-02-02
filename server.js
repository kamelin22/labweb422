/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ________________kamelin pajang______ Student ID: 186252219______________ Date: 2025/01/21________________
*  Vercel Link: _____https://labweb422-lfvs-iwykxj5up-kamelin22yahoocoms-projects.vercel.app/ also for using specific pages https://labweb422-lfvs-iwykxj5up-kamelin22yahoocoms-projects.vercel.app/api/movies?page=2&perPage=10__________________________________________________________
*
********************************************************************************/ 

const express = require('express');
const app = express();

const cors = require("cors");
require('dotenv').config();

const path = require('path'); // Add this line
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
// Serve the frontend (index.html) for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/', (req, res) => {
  res.json({message: "API listening"});
});

app.post("/api/movies", (req,res) => {
  db.addNewMovie(req.body)
      .then((movie) => {
          res.status(201).json(movie);
      }).catch((err) => {
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.get("/api/movies", (req, res) => {
  const { page, perPage, title } = req.query;

  db.getAllMovies(page, perPage, title)
    .then(data => {
      res.json(data);
    }).catch((err) => {
      res.status(500).json({ message: `an error occurred: ${err}` });
    });
}
);

app.get("/api/movies/:id",(req,res) => {
  db.getMovieById(req.params.id)
      .then(data => {
          res.json(data);
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.put("/api/movies/:id", (req,res) => {
  const id = req.params.id;

  db.updateMovieById(req.body, id)
      .then(() => {
          res.json({message: `movie ${id} successfully updated`});
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.delete("/api/movies/:id", (req,res)=>{
  db.deleteMovieById(req.params.id)
      .then(() => {
          res.status(204).end();
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.error(err);
});
////https://labweb422-h3w4-oqjjsul3n-kamelin22yahoocoms-projects.vercel.app
//https://my-7wiioi-kamelin22yahoocoms-projects.vercel.app/api/movies