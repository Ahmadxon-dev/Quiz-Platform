const multer = require('multer');
const path = require('path');

// Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads'); // Store the images in the 'uploads' folder temporarily
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid filename conflicts
//     },
// });
//
// // Initialize multer with storage configuration
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpg|jpeg|png|gif/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimeType = allowedTypes.test(file.mimetype);
//         if (extname && mimeType) {
//             return cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only jpg, jpeg, png, and gif are allowed.'));
//         }
//     },
// });
const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'answerImage', maxCount: 1 },
    { name: 'optionImages', maxCount: 4 }
]);

module.exports = upload;
