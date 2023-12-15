const path = require('path');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const generateUniqueId = require('generate-unique-id');
const products = require('../models/productsModel');

//Save Image on disk and change filename
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/product')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024, // 5MB file size limit
    },
});

// Validation array for product form data
const productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').trim().notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    body('des').trim().notEmpty().withMessage('Description is required'),
];


// For handling validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map((error) => extractedErrors.push({ [error.param]: error.msg }));

    return res.status(500).json({
        errors: extractedErrors,
    });

};

// For handling file upload and validation
const uploadImage = (req, res, next) => {
    upload.single('img')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // File size error
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(500).json({ error: 'File size exceeds the limit of 1 MB' });
            }
        } else if (err) {
            // Other file upload errors
            console.log(err);
            return res.status(500).json({ error: 'Error uploading file' });
        } else if (req.file) {
            // Check if the uploaded file is of JPG, JPEG or PNG mimetype
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(500).json({ error: 'Only JPG, JPEG and PNG image formats are allowed' });
            }
        }
        next();
    });
};

const saveData = async (req) => {
    const { name, price, des } = req.body;
    if (req.file) {
        const img = `images/product/${req.file.filename}`
        await products.create({
            id: generateUniqueId(),
            name,
            price,
            des,
            img,
            status: true
        })
    } else {
        await products.create({
            id: generateUniqueId(),
            name,
            price,
            des,
            status: true
        })
    }
}
module.exports = { productValidation, validate, uploadImage, saveData };
