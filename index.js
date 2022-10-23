const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 8080;

// PARSING MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// VIEW SETTINGS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// METHOD OVERRIDE
app.use(methodOverride('_method'));

let comments = [
    {
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol that is so funny!'
    },
    {
        id: uuidv4(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog.'
    },
    {
        id: uuidv4(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuidv4(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
]

app.get('/comments', (req, res) => {
    res.render('comments/index', { comments });
})

// FORM DATA ROUTE
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
})

app.post('/comments', (req, res) => {
    const { username, comment } = req.body;
    comments.push({ id: uuidv4(), username: username, comment: comment });
    res.redirect('/comments');
})

app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', { comment });
})

app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const foundComment = comments.find(c => c.id === id);
    foundComment.comment = newCommentText;
    res.redirect('/comments');
})

app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', { comment });
})

app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})

app.get('/tacos', (req, res) => {
    res.send("GET /tacos response");
})

app.post('/tacos', (req, res) => {
    const { meat, qty } = req.body;
    res.send(`OK, here are your ${qty} ${meat} tacos!`);
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