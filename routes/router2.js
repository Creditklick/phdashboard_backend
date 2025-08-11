const express = require('express');
const { UploadMileStone , getMileStoneData } = require('./../Controller/Controller_MileStrone');




const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });








const router_system2 = express.Router();

// The `upload.single('file')` middleware is used here.
// 'file' is the name of the form field that holds the uploaded file.
router_system2.post('/upload/milestones',upload.single('file'), UploadMileStone);


router_system2.post('/getdata/milestones',getMileStoneData);

module.exports = router_system2;