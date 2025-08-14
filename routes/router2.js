const express = require('express');
const { UploadMileStone , getMileStoneData , AddMonthMileStone , GetMonthMileStone  , updateMileStone , getSeniorMileStone} = require('./../Controller/Controller_MileStrone');




const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });








const router_system2 = express.Router();

// The `upload.single('file')` middleware is used here.
// 'file' is the name of the form field that holds the uploaded file.
router_system2.post('/upload/milestones',upload.single('file'), UploadMileStone);


router_system2.post('/getdata/milestones',getMileStoneData);











router_system2.post("/add_month/api",AddMonthMileStone);

router_system2.get('/get_month/api', GetMonthMileStone);


router_system2.post('/get_month/api',updateMileStone);


router_system2.get('/senior/milestone',getSeniorMileStone);












module.exports = router_system2;