const express = require('express');
const {UserSignup , UserLogin , verifyOtp, Logout , GetUser , UploadAttendence , getAttendenceData ,getdistint , TargetFile, saveTargetToAgentRecovery , getProcessReports , UploadTargetFile , esaudata , TargetAgentWise} = require('./../Controller/Controller')
const {authMiddleware} = require('./../Middleware/Middleware')
const {upload}  = require('./../config/multerConfig')

const router_system = express.Router();




router_system.post('/api/login',UserLogin);


router_system.post('/api/signup',UserSignup);
router_system.post('/api/verify',verifyOtp);
router_system.post('/api/logout',Logout);
router_system.get('/api/getUser',GetUser);


















router_system.post('/api/attendance/upload', upload.fields([
  { name: 'attendance', maxCount: 1 },
  { name: 'paid', maxCount: 1 }
]),UploadAttendence);



router_system.get('/api/attendance/getdata',getAttendenceData);


router_system.get('/api/attendance/getdistint',getdistint);

router_system.get('/api/dashboarddata',getProcessReports);





router_system.get('/api/target/data',TargetFile);   //may not required:





router_system.post('/api/saveTargetToAgentRecovery',saveTargetToAgentRecovery);   //make not required:







router_system.post('/api/agent/targetfile/upload', upload.single('file'), UploadTargetFile); //may not required:






router_system.get('/api/esau/target',esaudata);   //may not required:


router_system.post('/api/member/uplaod/target/agentwise',upload.single('file') ,TargetAgentWise);






module.exports = router_system;

