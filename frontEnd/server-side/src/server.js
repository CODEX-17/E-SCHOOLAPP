const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path');


//middleware//
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())



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
app.post('/questions', (req, res) => {
    const questionObj = req.body.dataObj
    
    const questionTitle = questionObj.questionTitle
    const questionDescription = questionObj.questionDescription
    const questionNumber = questionObj.questionNumber
    const questionContent = questionObj.questionContent
    const questionType = questionObj.questionType
    const required = questionObj.required
    const keySensitive = questionObj.keySensitive
    const points = questionObj.points
    const questionAnswerText = questionObj.questionAnswerText
    const choicesID = questionObj.choicesID
    const imageID = questionObj.imageID

    const query = "INSERT INTO questions (questionTitle, questionDescription, questionNumber, questionContent, questionType, points, required, keySensitive, questionAnswerText, choicesID, imageID) VALUES (?,?,?,?,?,?,?,?,?,?)"

    db.query(query, [questionTitle, questionDescription, questionNumber, questionContent, questionType, points, required, keySensitive, questionAnswerText, choicesID, imageID], (error, data, field) => {
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
app.post('/choices', (req, res) => {
        const choicesObj = req.body.dataObj
        const choicesID = choicesObj.choicesID
        const letter = choicesObj.letter
        const content = choicesObj.content
        const correct = choicesObj.correct

        const query = "INSERT INTO choices (choicesID, letter, content, correct) VALUES (?,?,?,?)"
   
        db.query(query, [choicesID, letter, content, correct], (error, data, field) => {
            if (error) {
                res.json(error)
            }else {
                res.json({
                    message: 'Choices added!'
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

app.post('/addClass', (req, res) => {
    const classDesc = req.body.classDesc
    const className = req.body.className
    const hidden = 'false'
    const query = "INSERT INTO class (className, classDesc, hidden) VALUES (?,?,?)"
   
    db.query(query,[className, classDesc, hidden], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('successfully added class!')
        }
    })

})


app.get('/getClass', (req, res) => {
    const query = "SELECT * FROM class"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.put('/hideClass/:id', (req, res) => {
    const id = req.params.id
    const state = req.body.state
    const query = "UPDATE class SET hidden =? WHERE id =?"

    db.query(query,[state, id], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('success update state!')
        }
    })
})


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })


app.post('/upload', upload.single('image'), (req, res) => {
    console.log('File uploaded:', req.file);
    
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const { originalname, mimetype, filename } = req.file;
    const imageID = req.body.imageID
  
    console.log('File properties:', originalname, mimetype, filename);
    const image = {
      name: originalname,
      type: mimetype,
      data: filename,
      imageID: imageID,
    };
  
    db.query('INSERT INTO image SET ?', image, (err) => {
      if (err) throw err;
      console.log('Image uploaded to the database');
      res.json({ message: 'Image uploaded successfully' });
    });
  });
  
  app.get('/get-image', (req, res) => {
    db.query('SELECT * FROM image WHERE id = 1', (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        const { data } = result[0]
        const filename = data.toString()
        const imagePath = path.join(__dirname, '../uploads', filename)
        res.sendFile(imagePath);
      } else {
        res.json({ message: 'Image not found' });
      }
    });
  });
  



const port = process.env.PORT || 5000

app.listen(port, ()=> {
    console.log('Listening to port: ', port)
})