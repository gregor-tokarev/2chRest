const { param, body, header } = require('express-validator');
const Treads = require('../models/treads');

const bodyCheck = [
    body('title', 'Некорректный заголовок')
        .trim()
        .isString()
        .isLength({ min: 1, max: 20 })
        .withMessage('Заголовок должен быть от 1 до 10 символов'),
    body('text')
        .trim()
        .isString()
        .isLength({ min: 5, max: 120 })
        .withMessage('Описание должно быть от 5 до 120 символов'),
    body('imagesUrl')
        .if(body('imagesUrl').exists())
        .isArray()
        .withMessage('ссылки должны быть валидными url')
];

exports.create = [
    param('treadId')
        .notEmpty()
        .withMessage('treadId must exist')
        .rtrim()
        .isAlphanumeric()
        .withMessage('Некорректный формат')
        .custom((value, context) => {
            return Treads
                .findById(value)
                .catch(error => {
                    throw new Error('Tread Not fond')
                })
        })
        .withMessage('Такого треда не существует')
]

exports.edit = [
    header('Authorization')
        .trim()
        .isString()
        .customSanitizer(value => value.split(' ')[1])
        .isJWT(),
]
