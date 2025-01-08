import {body} from 'express-validator';

export const messageCreateValidation = [
    body('text', "Сообщение не может быть пустым").isLength({min: 1}),
]