const ParksModel = require('../models/park_list');

const indexPark = async (req, res) => {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const parks = await ParksModel.find()
        // const countUsers = await UsersModel.countDocuments()
        res.render('parking-list', {
            park_list: parks,
            // current: pagination.page,
            // pages: Math.ceil(countUsers / pagination.perPage),
            // namepage: "account"
        })
    } catch (error) {
        console.log(error);
    }
}  

module.exports = {
    indexPark: indexPark,
}