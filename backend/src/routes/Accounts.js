const express = require('express')
const router = express.Router()

const CreateAccount = require('../services/CreateAccount')
const RetrieveAccount = require('../services/RetrieveAccounts')

router.post('/createAccounts', async (req, res) => {
    const {acctype, studentid, email, password} = req.body

    const results = await createAccount({acctype, studentid, email, password})

    if (results) {
        res
        .status(200)
        .send(
            {
                status: results,
                message: 'Successfully created account!'
            }
        )
    }else {
        res
        .status(500)
        .send(
            {
                status: results,
                message: 'not created account!'
            })
    }

})

router.get('/retrieve', async (req, res) => {
    const results = await RetrieveAccount()
    console.log(results)

    if (results) {
        res
        .status(200)
        .send(results)

    }else {
        res
        .status(500)
        .send({
            status: results,
            message: 'not Retrived!'
        })
    }

})

module.exports = router