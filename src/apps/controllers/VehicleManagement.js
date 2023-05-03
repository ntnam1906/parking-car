const CardsModel = require('../models/cards');
const VehiclesModel = require('../models/vehicle_management')
const ParksModel = require('../models/park_list')
const multer = require('multer');
const fs = require('fs');
const Buffer = require('buffer')
const mime = require('mime-types')
const moment = require('moment');
const path = require('path');


const indexVehicle = async (req, res) => {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 5,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const vehicles = await VehiclesModel.find().skip(noPage).limit(pagination.perPage).populate('card_id').populate('parking_id');
        const countVehicles = await VehiclesModel.countDocuments()
        const cards = await CardsModel.find()
        const parks = await ParksModel.find()
        res.render('car', {
            vehicles,
            cards,
            parks,
            error: null,
            massage: null,
            current: pagination.page,
            pages: Math.ceil(countVehicles / pagination.perPage),
            namepage: "car"
        })
    } catch (error) {
        console.log(error);
    }
}

const checkApi = async(req, res) => {
    try {
        const cardId = req.body.cardId
        const parkId = req.body.parkId

        /// Lấy dữ liệu ảnh 
        const imagePath = req.file.path

        const buffer = fs.readFileSync(imagePath)
        const contentType = mime.contentType(path.extname(req.file.originalname))

        if(!cardId || !parkId) {
            return res.status(500).json({
                message: "Thiếu dữ liệu"
            })
        }
        
        const card = await CardsModel.findOne({id: cardId})
        const park = await ParksModel.findOne({parkId: parkId})
        //Trường hợp xe vào
        if(card.is_parking === false) {
            if(card.full_name !== "Khách vãng lai") {
                ///// Trường hợp khách đã đăng kí nhưng chưa kích hoạt
                if(card.status === false) {
                    return res.status(401).json({
                        message: "Thẻ chưa được kích hoạt"
                    })
                }

                ///// Trường hợp khách đã đăng kí và đã kích hoạt
                else {
                    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

                    const vehicle = await VehiclesModel.create({
                        image_in: `${req.file.filename}`,
                        image_out: null,
                        parking_id: park._id,
                        card_id: card._id,
                        timeIn: currentDateTime,
                        timeOut: null
                    })
                    await CardsModel.findOneAndUpdate({id: cardId}, {
                        is_parking: true
                    })
                    res.status(200).json({
                        message: "Gửi xe thành công"
                    })
                }
            }
            ///// Trường hợp khách vãng lai
            else {
                const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

                const vehicle = await VehiclesModel.create({
                    image_in: `/uploads/${req.file.filename}`,
                    image_out: null,
                    parking_id: park._id,
                    card_id: card._id,
                    timeIn: currentDateTime,
                    timeOut: null
                })
                await CardsModel.findOneAndUpdate({id: cardId}, {
                    is_parking: true
                })
                res.status(200).json({
                    message: "Gửi xe thành công"
                })
            }
        }
        // Trường hợp xe ra
        else {
            const parkIn = await VehiclesModel.findOne({card_id: card._id}).sort({updatedAt: -1}).limit(1)
           
            ////Trường hợp xe vào ở bãi này nhưng ra ở bãi khác (VD gửi bãi 1 nhưng quẹt thẻ bãi 2)
            if(!parkIn.parking_id.equals(park._id)) {
                return res.status(500).json({
                    message: "Xe không được gửi ở bãi này"
                })
            }
            else {
                const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

                const vehicle = await VehiclesModel.findOneAndUpdate({card_id: card._id},{
                    image_out: `/uploads/${req.file.filename}`,
                    timeOut: currentDateTime
                }, { sort: { updatedAt: -1 } })
                await CardsModel.findOneAndUpdate({id: cardId}, {
                    is_parking: false
                })
                res.status(200).json({
                    message: "Xe ra thành công"
                })
            }
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }

}


module.exports = {
    indexVehicle: indexVehicle,
    checkApi: checkApi
}