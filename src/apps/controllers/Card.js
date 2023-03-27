const CardsModel = require('../models/cards');
const UsersModel = require('../models/users');


const indexCard = async (req, res) => {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const cards = await CardsModel.find();
        // const countUsers = await UsersModel.countDocuments()
        res.render('card', {
            cards: cards,
            error: null,
            massage: null
            // current: pagination.page,
            // pages: Math.ceil(countUsers / pagination.perPage),
            // namepage: "account"
        })
    } catch (error) {
        console.log(error);
    }
}  
const addCards = async (req, res) => {
    const cards = await CardsModel.find()
    res.render('card', {
        cards: cards,
        error: null,
        message: null
    })
}

const newCards = async (req, res) => {
    const Card = {
        id: req.body.id_,
        full_name: req.body.full_name,
        activeAt: req.body.active_date,
        role: req.body.role,
        status: req.body.is_active
    }
    try {
        const checkID = await CardsModel.findOne({id : Card.id})
        if(!checkID){
            const createCard = new CardsModel({
                full_name: Card.full_name,
                id: Card.id,
                activeAt: Card.activeAt,
                role: Card.role,
                status: Card.status
            })
            const saveUser = await createCard.save();
            res.redirect('/card')
            console.log("Thêm thành công")
        }
        else {
            res.redirect('/card')
        }
    } catch (error) {
        return res.render('card', {
            error: error.message,
            message: null
        })
    }
}
const getRemoveCard = async (req, res) => {
    const cards = await CardsModel.find()
    res.render('card', {
        cards: cards,
        error: null,
        message: null
    })
}
const deleteCard = async (req, res) => {
    try {
        const check = await CardsModel.deleteOne({ id: req.body.id1 })
        if(check) {
            res.send("success");
            res.redirect('/card');
        }
        else {
            res.send("fail");
            res.redirect('/card');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    indexCard: indexCard,
    addCards: addCards,
    newCards: newCards,
    deleteCard: deleteCard,
    getRemoveCard: getRemoveCard
}