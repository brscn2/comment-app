const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require("mongodb");
require('dotenv').config();
const PORT = process.env.PORT || 8080
// Replace the uri string with your connection string.
const uri =
    "mongodb+srv://brscn:78952Gn@cluster0.k7xaqxb.mongodb.net/?retryWrites=true&w=majoritymongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";

const client = new MongoClient(process.env.uri);
const database = client.db("commentdb");
const collection = database.collection("comments");

// PARSING MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// VIEW SETTINGS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// METHOD OVERRIDE
app.use(methodOverride('_method'));

app.get('/comments', async (req, res) => {
    const cursor = collection.find({});
    const comments = await cursor.toArray();
    res.render('comments/index', { comments });
})

// FORM DATA ROUTE
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
})

app.post('/comments', async (req, res) => {
    const { username, comment } = req.body;
    const doc = { _id: uuidv4(), username: username, comment: comment };
    const result = collection.insertOne(doc, { writeConcern: { w: "majority" , wtimeout: 5000 } });
    console.log(
        `A document was inserted with the _id: ${doc._id}`,
    );
    res.redirect('/comments');
})

app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const comment = await collection.findOne({ _id: id });
    res.render('comments/show', { comment });
})

app.patch('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const result = await collection.updateOne({ _id: id }, { $set: { comment: newCommentText } }, { writeConcern: { w: "majority" , wtimeout: 5000 } });
    if(result.acknowledged)
        res.redirect("/comments");
})

app.get('/comments/:id/edit', async (req, res) => {
    const { id } = req.params;
    const comment = await collection.findOne({ _id: id });
    res.render('comments/edit', { comment });
})

app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const deleteResult = await collection.deleteOne({ _id: id }, { writeConcern: { w: "majority" , wtimeout: 5000 } });
    res.redirect('/comments');
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});

/*
    GET /comments - list all comments
    POST /comments - create a new comment
    GET /comments/:id - get particular comment using id
    PATCH /comments/:id - update particular comment
    DELETE /comments/:id - delete particular comment
*/