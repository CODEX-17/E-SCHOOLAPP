const account = require('../models/Accounts')

module.exports = async () => {
    try{
         results = await account.find()
        return results
    }
    catch (err) {
        return []
    }
}