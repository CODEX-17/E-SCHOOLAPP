const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const http = require('http')
const socketIO = require('socket.io')
const schedule = require('node-schedule')

///new

const corsOptions = {
    origin: '*', // Replace with the origin of your React app
    credentials: true, // Enable credentials (if needed)
};

//middleware//
const app = express()
app.use(express.json())
app.use(cors())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.static('uploads'))
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173', // Replace with the origin of your React app
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e-school-app'
})




io.on('connection', (socket) => {
    
    let onlineList = []
    let currentAcctId = ''
    const date = new Date(2023, 11, 31, 18, 48, 0)

    // const job = schedule.scheduleJob('*/10 * * * * *', function(){
    //     console.log('Its new year NEW!')
    //     //io.emit('testLang', 'Its new year NEW!')
    // });

    socket.on('online', (acctID) => {
        currentAcctId = acctID
        onlineList.push(acctID)
        io.emit('onlinePerson', onlineList)
    })

    socket.on('typing', (room, data) => {
        socket.join(room)
        io.to(room).emit('isTyping', data)
    })

    socket.on('testingJoin', (roomID, name) => {
        socket.join(roomID)
        io.emit('testingJoined', name)
    });

    socket.on('joinRoom', (room, name) => {
        socket.join(room)
        io.emit('joinedRoom', name+' you have been joined in ROOM:'+room)
    });

    socket.on('testingMessage', (room, message) => {
        socket.join(room)
        io.to(room).emit('testingReceived', message)
    });

    socket.on('sendMessage', (room, dataObj) => {
       socket.join(room)
       io.to(room).emit('mess', dataObj)
       console.log(room, dataObj)
    });

    socket.on('disconnect', () => {
       onlineList = onlineList.filter((acct) => acct!== currentAcctId)
    });
})


   


// database connection//


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

app.get('/getMembers', (req, res) => {
    const query = "SELECT * FROM members"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.get('/getMessages', (req, res) => {
    const query = "SELECT * FROM messages"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.get('/getFriend', (req, res) => {
    const query = "SELECT * FROM friends"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})


app.get('/getAcctById/:id', (req, res) => {
    const id = req.params.id
    const query = "SELECT * FROM accounts WHERE acctID =?"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.get('/getQuiz', (req, res) => {
    const query = "SELECT * FROM quiz"
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
    const questionID = req.body.id
    const questionNumber = questionObj.questionNumber
    const questionContent = questionObj.questionContent
    const questionType = questionObj.questionType
    const required = questionObj.required
    const keySensitive = questionObj.keySensitive
    const points = questionObj.points
    const questionAnswerText = questionObj.questionAnswerText
    const choicesID = questionObj.choicesID
    const imageID = questionObj.imageID
    const fillLayoutID = questionObj.fillLayoutID
    const subjectName = questionObj.subjectName

    const query = "INSERT INTO questions (questionID, questionNumber, questionContent, questionType, points, required, keySensitive, questionAnswerText, choicesID, imageID, fillLayoutID, subjectName) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"

    db.query(query, [questionID, questionNumber, questionContent, questionType, points, required, keySensitive, questionAnswerText, choicesID, imageID, fillLayoutID, subjectName], (error, data, field) => {
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

app.post('/saveMessages', (req, res) => {
   
    const messageID = req.body.messageID
    const roomID =  req.body.roomID
    const messageContent =  req.body.messageContent
    const messageSender =  req.body.messageSender
    const messageReceiver =  req.body.messageReceiver
    const date =  req.body.date
    const time =  req.body.time

    console.log(date)

    const query = "INSERT INTO messages (messageID, roomID, messageContent, messageSender, messageReceiver, date, time) VALUES (?,?,?,?,?,?,?)"

    db.query(query, [messageID, roomID, messageContent, messageSender, messageReceiver, date, time], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.json({
                message: 'message added!'
            })
        }
    })    
})

app.post('/quiz', (req, res) => {
    const quizID = req.body.id
    const quizTitle = req.body.quizTitle
    const quizInstructions = req.body.quizInstructions
    const questionID = req.body.id
    const subjectName = req.body.subjectName
    const totalPoints = req.body.totalPoints
    const totalQuestions = req.body.totalQuestions
    const creator = req.body.fullname
    const time = req.body.currentTime
    const date = req.body.currentDate


    const query = "INSERT INTO quiz (quizID, quizTitle, quizInstructions, questionID, subjectName, totalPoints, totalQuestions, creator, time, date) VALUES (?,?,?,?,?,?,?,?,?,?)"

    db.query(query, [quizID, quizTitle, quizInstructions, questionID, subjectName, totalPoints, totalQuestions, creator, time, date], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.json({
                message: 'quiz added!'
            })
        }
    })    
})




app.get('/getChoices', (req, res) => {
    const query = 'SELECT * FROM choices'

    db.query(query, (error, data, field) => {
        if (error) {
            res.status(404).json(error)
        }else {
            res.status(200).json(data)
        }
    })
})

app.get('/getSubjects', (req, res) => {
    const query = 'SELECT * FROM subject'

    db.query(query, (error, data, field) => {
        if (error) {
            res.status(404).json(error)
        }else {
            res.status(200).json(data)
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
    const acctID = req.body.acctID
    const hidden = 'false'
    const query = "INSERT INTO class (className, classDesc, acctID, hidden) VALUES (?,?,?,?)"
   
    db.query(query,[className, classDesc, acctID, hidden], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('successfully added class!')
        }
    })

})

app.post('/fillLayout', (req, res) => {
    const data = req.body.data
    const fillContent = data.fillContent
    const fillType = data.fillType
    const fillPosition = data.fillPosition
    const fillLayoutID = data.fillLayoutID

    console.log()

    const query = "INSERT INTO filllayout (fillContent, fillType, fillPosition, fillLayoutID) VALUES (?,?,?,?)"
   
    db.query(query,[fillContent, fillType, fillPosition, fillLayoutID], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('successfully added fillLayout!')
        }
    })

})

app.get('/getFillLayout', (req, res) => {
    const query = "SELECT * FROM filllayout"

    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.json(data)
        }
    })

})

app.post('/uploadPost', (req, res) => {
    const acctID = req.body.acctID
    const datePosted = req.body.datePosted
    const fileID = req.body.fileID
    const heartCount = req.body.heartCount
    const imageID = req.body.imageID
    const likeCount = req.body.likeCount
    const name = req.body.name
    const postContent = req.body.postContent
    const replyID = req.body.replyID
    const subjectName = req.body.subjectName
    const timePosted = req.body.timePosted
    const classCode = req.body.classCode
    const postType = req.body.postType
    const quizID = req.body.quizID
    const duration = req.body.duration
    
    const query = "INSERT INTO post (acctID, name, timePosted, datePosted, postContent, replyID, imageID, fileID, heartCount, likeCount, classCode, subjectName, postType, quizID, duration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
   
    db.query(query,[acctID, name, timePosted, datePosted, postContent, replyID, imageID, fileID, heartCount, likeCount, classCode, subjectName, postType, quizID, duration], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('successfully added post!')
        }
    })

})


app.get('/getPost', (req, res) => {
    const query = "SELECT * FROM post"
    db.query(query, (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.json(data)
        }
    })
})

app.delete('/deletePost/:id', (req, res) => {
    const id = req.params.id
    const query = "DELETE FROM post WHERE id =?"
    db.query(query,[id], (error, data, field) => {
        if (error) {
            res.json(error)
        } else {
            res.send('success deleted post!')
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

app.put('/hideClass', (req, res) => {
    const acctID = req.body.acctID
    const membersID = req.body.membersID
    const state = req.body.state
    const query = "UPDATE members SET hidden =? WHERE acctID =? AND membersID=?"

    db.query(query,[state, acctID, membersID], (error, data, field) => {
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

  app.post('/uploadFile', upload.single('file'), (req, res) => {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const { originalname, mimetype, filename } = req.file;
    const fileID = req.body.fileID
  
    console.log('File properties:', originalname, mimetype, filename);
    const file = {
      name: originalname,
      type: mimetype,
      data: filename,
      fileID: fileID,
    };
  
    db.query('INSERT INTO files SET ?', file, (err) => {
      if (err) throw err;
      console.log('file uploaded to the database');
      res.json({ message: 'file uploaded successfully' });
    });
  });
  
  app.get('/ ', (req, res) => {
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

  app.get('/getImageByID/:id', (req, res) => {
    const id = req.params.id
    const query = 'SELECT * FROM image WHERE imageID = ?'

    db.query(query,[id], (err, result) => {
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

  app.get('/getALLImages', (req, res) => {
    const query = 'SELECT * FROM image'

    db.query(query, (err, data, result) => {
      if (err) {
        res.json(err)
      } else {
        res.send(data);
      }
    });
  });

  app.get('/getALLfiles', (req, res) => {
    const query = 'SELECT * FROM files'

    db.query(query, (err, data, result) => {
      if (err) {
        res.json(err)
      } else {
        res.send(data);
      }
    });
  });

  app.put('/updateImageAcct', upload.single('image'), (req, res) => {
  
    const query = 'UPDATE image SET name=?, type=?, data=? WHERE imageID =?'
    const { originalname, mimetype, filename } = req.file
    const imageID = req.body.imageID
  
    // console.log('File properties:', originalname, mimetype, filename);
    // console.log(imageID)

    const image = {
      name: originalname,
      type: mimetype,
      data: filename,
      imageID: imageID,
    };
  

    db.query(query,[originalname, mimetype, filename, imageID], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('success update state!')
        }
    })
  })

  app.get('/getImage/:id', (req, res) => {
    const id = req.params.id
    const query = 'SELECT * FROM image WHERE imageID =?'
    db.query(query, [id], (error, data, field) => {
        if (error) {
            res.status(500).send('Internal Server Error')
        }else {
            res.json(data)
        }
    })
  })

  app.put('/updatePassword/:id', (req, res) => {
    const id = req.params.id
    const password = req.body.newPass
    const query = "UPDATE accounts SET password =? WHERE acctID =?"

    db.query(query,[password, id], (error, data, field) => {
        if (error) {
            res.json(error)
        }else {
            res.send('success update state!')
        }
    })
    })

//   app.delete('/deleteImage/:oldImageID', (req, res) => {
//     const oldImageID = req.params.oldImageID
//     const filename = req.body.oldImageFileName
//     const filePath = `../uploads/${filename}`
//     const query = 'DELETE FROM image WHERE imageID =?'

//     console.log('oldImageID:' + oldImageID)
//     console.log('filename:' + filename)
//     console.log('filePath:' + filePath)

//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error('Error deleting image file:', err)
//             return res.status(500).json({ message: 'Internal Server Error' })
//         }
//     })

//     db.query(query, [oldImageID], (error,data, field) => {
//         if (error) {
//             res.status(500).send('Error deleting image from database Server Error')
//         }else {
//             res.json({message: 'Image deleted successfully'})
//         }
//     })


//   })
  



const port = process.env.PORT || 5000

server.listen(port, ()=> {
    console.log('Listening to port: ', port)
})