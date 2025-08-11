const express=  require('express');

const Pool = require('./config/config');
const router_system = require('./routes/router1');
const router_system2 = require('./routes/router2')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const port = 5000;
const app = express();








// const allowedOrigins = [
//   //  'http://localhost:5173',
//    "*"
//   //'https://phdashboard-frontend.vercel.app',
// ];


const allowedOrigins = [
  'https://phdashboard-frontend.vercel.app',
  'http://localhost:5173',
  //  'http://172.16.0.175:5173', // your local network IP
  //  'http://172.16.1.239:5173'
];


// Apply CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Optional: handle preflight for all routes
app.options('*', cors());


// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

app.use(bodyParser.json());


//https://phdashboard-backend.onrender.com   //backend url
//https://phdashboard-frontend.vercel.app/       //frontend url

// Add cookie parser middleware
app.use(cookieParser());


app.use('/ph',router_system);

app.use('/milestone',router_system2);


app.get('/',(req,res)=>{
      console.log("testing part");
      return res.status(201).json({success: true , message : "Backend in running on port "});
})


app.listen(port,()=>{
      console.log("App start on port",`${port}`);
})