const { param, body, header } = require('express-validator');
const { isURL } = require('validator');
const Board = require('../models/boards');

const bodyCheck = [
    body('title', 'Некорректный заголовок')
        .notEmpty()
        .withMessage('Тема нужна')
        .trim()
        .isString()
        .isLength({ max: 100 })
        .withMessage('Заголовок должен быть от 1 до 100 символов'),
    body('text')
        .trim()
        .isString()
        .isLength({ min: 5, max: 4000 })
        .withMessage('Описание должно быть от 5 до 2000 символов'),
    body('imagesUrl')
        .if(body('imagesUrl').exists())
        .isArray()
        .withMessage('Не массив')
        .custom((value, context) => value.every(img => isURL(img.url)))
        .withMessage('ссылки должны быть валидным url')
]

exports.create = [
    ...bodyCheck,
    param('boardId')
        .not()
        .isEmpty()
        .withMessage('Id must exist')
        .rtrim()
        .isAlphanumeric()
        .withMessage('Некорректный формат')
        .custom((value, context) => {
            return Board
                .findById(value)
                .catch(error => {
                    throw new Error('Board Not fond')
                })
        })
        .withMessage('Такой доски не существует'),
]

exports.operations = [
    header('Authorization')
        .trim()
        .isString()
        .customSanitizer(value => value.split(' ')[1])
        .isJWT(),
    param('treadId')
        .notEmpty()
        .withMessage('treadId must exist')
]
