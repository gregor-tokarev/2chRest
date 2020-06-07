const { param, body, header } = require('express-validator');
const Treads = require('../models/treads');
const { isURL } = require('validator');

const bodyCheck = [
    body('text')
        .trim()
        .isString()
        .isLength({ min: 5, max: 2000 })
        .withMessage('Описание должно быть от 5 до 2000 символов'),
    body('imagesUrl')
        .if(body('imagesUrl').exists())
        .isArray()
        .custom((value, context) =>
            value.every(img => isURL(img.url))
        )
        .withMessage('ссылки должны быть валидными url')
];

exports.create = [
    ...bodyCheck,
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
    ...bodyCheck,
    header('Authorization')
        .trim()
        .isString()
        .customSanitizer(value => value.split(' ')[1])
        .isJWT(),
]
