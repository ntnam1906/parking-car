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
const deletePark = async (req, res) => {
    try {
        const park = await ParksModel.deleteOne({
            _id: req.params.id
        })
        res.redirect('/parking-list')
    } catch (error) {
        console.log(error);
    }
}
const addPark = async (req, res) => {
    const parks = await ParksModel.find()
    res.render('add_park', {
        parks: parks,
        error: null,
        message: null
    })
}
const newPark = async (req, res) => {
    const park = {
        name: req.body.name,
        address: req.body.address,
    }
    try {
        const check = await ParksModel.findOne({name: park.name})
        if(!check) {
            const createPark = new ParksModel({
                ame: park.name,
                address: park.address,
            })
            const savePark = await createPark.save()
            res.redirect('/parking-list')
        }
        else {
            res.redirect(req.originalUrl)
        }
    } catch (error) {
        res.render('add_park', {
            error: error.message,
            message: null,
        })
    }
}
const editPark = async (req, res) => {
    const park = await ParksModel.findOne({
        _id: req.params.id
    })
    res.render('edit_park', {
        park: park,
        error: null,
        message: null
    })
}

const updatePark = async (req, res) => {
    const park = {
        name: req.body.name,
        address: req.body.address,
    }
    
    try {
        const update = await ParksModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            name: park.name,
            address: park.address,
        })
       
        res.redirect('/parking-list')
    } catch (error) {
        res.render('edit_park', {
            error: error.message,
            message: null,
        })
    }

}
module.exports = {
    indexPark: indexPark,
    deletePark: deletePark,
    addPark: addPark,
    newPark: newPark,
    editPark: editPark,
    updatePark: updatePark
}