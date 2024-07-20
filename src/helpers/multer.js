const multer = require('multer');
const path = require('path');

// uploads dizininin mutlak yolunu oluşturun
const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`); 
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
