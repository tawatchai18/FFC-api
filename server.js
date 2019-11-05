const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ffc'
const PORT = process.env.PORT || 7000

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

mongoose.connection.on('error', err => {
  console.error('MongoDB error', err)
})

app.use(express.json())

app.get('/person', async (req, res) => {
  const person = await Person.find({})
  res.send(person)
  console.log(res.send(person),'=======');
})

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`)
})