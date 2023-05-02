const express = require('express')
const app = express()

//routes
const indexRoute = require('./routes/index')

const port = 3000

const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')

const MongoClient = require('mongodb').MongoClient
const connString = "mongodb+srv://adzickarlo74:ltdh-101fm8112@projects.aabtuwh.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(connString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('projects')
    const projectsCollection = db.collection('projects')

    app.set('view engine', 'ejs')
    app.use(express.json());

    app.use("/", indexRoute)

    app.use(express.static('public'))

    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/projects', (req, res) => {
      projectsCollection
      .find()
      .toArray()
      .then(results => {
        res.render('projects.ejs', { projects: results })
      })
    .catch(error => console.error(error))
    })

    app.get('/projects/edit/:id', (req, res) => {
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(data => {
        res.render('edit-project.ejs', { project: data })
      })
    })

    app.get('/projects/details/:id', (req, res) => {
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((data) => {
          res.render('project-details.ejs', { project: data })
      })
    })

    app.post('/projects', (req, res) => {
        projectsCollection
        .insertOne(req.body)
        .then(() => {
            res.redirect('/projects')
        })
        .catch(error => console.error(error))
    })

    app.put('/projects/edit/:id/update', (req, res) => {
      projectsCollection
      .updateOne(
        { _id: new ObjectId(req.params.id) }, 
        { $set: 
          { 
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            jobs: req.body.jobs,
            start: req.body.start,
            end: req.body.end,
          }
        })
        .then(() => {
          res.redirect('/projects')
        })
    })

    app.delete('/projects/delete/:id', (req, res) => {
      projectsCollection
      .remove({ _id: new ObjectId(req.params.id) })
      .then(() => {
        res.redirect('/projects')
      })
    })

    app.listen(port, () => {
        console.log('Listening on port ' + port)
    })
  })
  .catch(error => console.error(error))