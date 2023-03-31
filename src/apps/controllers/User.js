const UsersModel = require('../models/users');
const config = require('config');

const indexUser = async (req, res) => {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const users = await UsersModel.find()
        // const countUsers = await UsersModel.countDocuments()
        res.render('account', {
            users: users,
            // current: pagination.page,
            // pages: Math.ceil(countUsers / pagination.perPage),
            // namepage: "account"
        })
    } catch (error) {
        console.log(error);
    }
}  
const deleteUser = async (req, res) => {
    try {
        const user = await UsersModel.deleteOne({
            _id: req.params.id
        })
        res.redirect('/account')
    } catch (error) {
        console.log(error);
    }
}
const addUser = async (req, res) => {
    const users = await UsersModel.find()
    res.render('add_account', {
        users: users,
        error: null,
        message: null
    })
}
const newUser = async (req, res) => {
    const user = {
        full_name: req.body.full_name,
        user_name: req.body.username,
        password: req.body.pass,
        role: req.body.role,
    }
    try {
        const check = await UsersModel.findOne({user_name: user.user_name})
        if(!check) {
            const createUser = new UsersModel({
                full_name: user.full_name,
                user_name: user.user_name,
                password: user.password,
                role: user.role,
            })
            const saveUser = await createUser.save()
            res.redirect('/account')
        }
        else {
            res.redirect(req.originalUrl)
        }
    } catch (error) {
        res.render('add_account', {
            error: error.message,
            message: null,
        })
    }
}
const editUser = async (req, res) => {
    const user = await UsersModel.findOne({
        _id: req.params.id
    })
    res.render('edit_account', {
        user: user,
        error: null,
        message: null
    })
}

const updateUser = async (req, res) => {
    const user = {
        full_name: req.body.full_name,
        user_name: req.body.username,
        password: req.body.pass,
        role: req.body.role,
    }
    
    try {
        const update = await UsersModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            full_name: user.full_name,
            user_name: user.user_name,
            password: user.password,
            role: user.role,
        })
       
        res.redirect('/account')
    } catch (error) {
        res.render('edit_account', {
            error: error.message,
            message: null,
        })
    }

}
module.exports = {
    indexUser: indexUser,
    deleteUser: deleteUser,
    addUser: addUser,
    newUser: newUser,
    editUser: editUser,
    updateUser: updateUser
}