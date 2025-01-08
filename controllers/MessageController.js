import MessageModel from "../models/Message.js"

export const getAll = async (req, res) => {
    try {
        const messages = await MessageModel.find().populate({ path: "user", select: ["fullName", "email"] }).exec();    

        res.json(messages);
    } 
    catch (err) {
        console.log(err);
        res.status(404).json({
            message: "Ничего не найдено"
        })
    }
}

export const getById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await MessageModel.findById(messageId).populate({ path: "user", select: ["fullName", "email"] }).exec();

        res.json(message);
    } 
    catch (err) {
        console.log(err);
        res.status(404).json({
            message: "Сообщение не найдено"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new MessageModel({
            text: req.body.text,
            user: req.userId
        })

        const message = await doc.save();

        res.json(message)
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось отправить сообщение"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const messageId = req.params.id;
        const result = await MessageModel.findByIdAndDelete({ _id: messageId });

        if(!result) {
            return res.status(404).json({
                message: 'Сообщение не найдено'
            })
        }
        else {
            res.json({
                success: true
            })
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить сообщения"
        })
    }
}