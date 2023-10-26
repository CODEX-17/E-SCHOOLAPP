const accounts = require('../models/Accounts')

module.exports = async (dataObj) => {
    try {
        await account.insertMany(dataObj)
        return true
    }catch(err) {
        return false
    }
}