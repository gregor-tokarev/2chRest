const { body } = require('express-validator');

exports.create = [
    body('title', 'Некорректный заголовок')
        .trim()
        .isLowercase()
        .isAlphanumeric()
        .isLength({ min: 1, max: 20 })
        .withMessage('Заголовок должен быть от 1 до 10 символов'),
    body('description')
        .trim()
        .isString()
        .isLength({ min: 5, max: 120 })
        .withMessage('Описание должно быть от 5 до 120 символов')
]
