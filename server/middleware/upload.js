const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'answerImage', maxCount: 1 },
    { name: 'optionImages', maxCount: 4 }
]);

module.exports = upload;
