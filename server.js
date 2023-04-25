//const express = require('express');
import express from 'express';
import { listDirectory, isFolder, createDirectory, deleteFileOrDirectory, uploadFile, uploadFileBusboy} from './functions.js';
import bb from 'express-busboy';
import os from 'os';

const app = express();
const port = 3000;

const path = "/tmp/back/"; //os.tmpdir() + '/backend/';
console.log(path);

app.use(express.static('frontend'));

bb.extend(app, {
    upload: true,
    //    path: path,
    allowedPath: /./,
    headers : {'content-type' : 'multipart/form-data'}
})

app.get('/api/drive/*', (req, res) => {
    isFolder(path + req.params['0'])
        .then(isFolder => {
            if (isFolder) {
                listDirectory(path + req.params["0"] + "/")
                    .then(nextFiles => res.status(200).type('application/json').send(nextFiles))
                    .catch(err => console.log(err.message))
            } else {
                res.status(200).type('application/octet-stream').sendFile(path + req.params["0"]);
            }
        })
        .catch(err => res.status(404).send('Erreur 404' + err.message));
});
app.post('/api/drive/*', (req, res) => {
    createDirectory(path + req.params['0'] + '/', req.query.name)
        .then(newDirectory => res.status(200).send(newDirectory))
        .catch(err => res.status(400).send('Erreur 400 ' + err.message));
});
app.put('/api/drive/*', (req, res) => {
    console.log('log',req.params)
    uploadFileBusboy(path+req.params['0'], req.files.file)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(400).send('Erreur 400 ' + err.message));
});
app.delete('/api/drive/*', (req, res) => {
    deleteFileOrDirectory(path, req.params['0'])
        .then(objToDelete => res.status(200).send(objToDelete))
        .catch(err => res.status(400).send('Erreur 400 ' + err.message));
});

function startServeur() {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
};

// Avec require 
// exports.startServeur = startServeur;
// Avec import, export
export { startServeur };