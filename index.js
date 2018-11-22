const express = require('express');
const Joi = require('joi');
const postits = require('./post-its.js');
const app = express();

app.use(express.json());

//mostra os post-its
app.get('/', (req, res) => res.send('Hello world!'));
app.get('/api/postits', (req, res) => res.send(postits));
app.get('/api/postits/:id', (req, res) => {
    const foundPostIt = postits.find(postit => postit.id === parseInt(req.params.id));
    if(!foundPostIt) {
        return res.status(404).send('Deu Merda');
    }

    res.send(foundPostIt);
});

//cadastra novo post-it
app.post('/api/postits', (req, res) => {
    const id = Math.max(...postits.map(postit => postit.id)) + 1;
    const newPostIt = {
        id,
        title: req.body.title,
        text: req.body.text
    };

    const schema = {
        title: Joi.string().min(1).required(),
        text: Joi.string().min(1).required()
    }
    const validation = Joi.validate(req.body, schema);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    } 

    postits.push(newPostIt);
    res.send(newPostIt);
});

//modifica o post-it
app.put('/api/postits/:id', (req, res) => {
    const updatePostIt = postits.find(postit => postit.id === parseInt(req.params.id));
    const schema = {
        title: Joi.string().min(1).required(),
        text: Joi.string().min(1).required()
    }
    const validation = Joi.validate(req.body, schema);
    if(!updatePostIt) {
        return res.status(404).send('Não encontramos esse post-it :(');
    }
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    } 
    updatePostIt.title = req.body.title;
    updatePostIt.text = req.body.text;
    
    res.send(updatePostIt);
    
})

//deleta o post-it
app.delete('/api/postits/:id', (req, res) => {
    const deletePostIt = postits.find(user => user.id === parseInt(req.params.id));
    const index = postits.indexOf(deletePostIt);
    if(index > -1){
        postits.splice(index, 1);
        res.send(deletePostIt);
    }
    
})

app.listen(3001, () => console.log('Ouvindo na porta 3001.............'));