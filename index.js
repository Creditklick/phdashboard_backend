const express=  require('express');

const Pool = require('./config/config');
const router_system = require('./routes/router1');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const port = 5000;
const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());




// Add cookie parser middleware
app.use(cookieParser());


app.use('/ph',router_system);


app.post('/',(req,res)=>{
      return res.status(201).json({success: true , message : "Backend in running"});
})


app.listen(port,()=>{
      console.log("App start on port",`${port}`);
})