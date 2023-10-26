const express = require('express')
const cors = require('cors')
const mysql = require('mysql')

//middleware//
const app = express()
app.use(express.json())
app.use(cors())


// database connection//
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e-school-app'
})

// get accounts//
app.get('/getAccount', (req, res) => {
    const query = "SELECT * FROM accounts"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

// update status from account (login:logout)//
app.put('/status/:id', (req, res) => {
    const id = req.params.id
    const status = req.body.status

    console.log(status, id)
    
    const query = "UPDATE accounts SET status =? WHERE id =?"

    db.query(query, [status, id], (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json({
                message: 'Account status updated!'
            })
        }
    })
})

// add question//
app.put('/questions', (req, res) => {

    const questionTitle = req.body.questionTitle
    const questionDescription = req.body.questionDescription
    const questionNumber = req.body.questionNumber
    const questionContent = req.body.questionContent
    const questionType = req.body.questionType
    const points = req.body.points
    const required = req.body.required

    console.log(req.body.questionNumber)

    const query = "INSERT INTO questions (questionTitle, questionDescription, questionNumber, questionContent, questionType, points, required) VALUES (?,?,?,?,?,?,?)"

    db.query(query, [questionTitle, questionDescription, questionNumber, questionContent, questionType, points, required], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.json({
                message: 'Question added!'
            })
        }
    })

})

// add choices//
app.put('/choices', (req, res) => {

    const questionID = req.body.questionID
    const letter = req.body.letter
    const content = req.body.content
    const correct = req.body.correct

    const query = "INSERT INTO choices (questionID, letter, content, correct) VALUES (?,?,?,?)"
   
    db.query(query, [questionID, letter, content, correct], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.json({
                message: 'Question added!'
            })
        }
    })

})

// get questions //
app.get('/getQuestion', (req, res) => {
    const query = "SELECT * FROM questions"

    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.json(data)
        }
    })

})


const port = process.env.PORT || 5000

app.listen(port, ()=> {
    console.log('Listening to port: ', port)
})