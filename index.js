const express=  require('express');

const Pool = require('./config/config');
const router_system = require('./routes/router1');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const port = 5000;
const app = express();








const allowedOrigins = [
  'http://localhost:5173',
  'https://phdashboard-frontend.vercel.app/',
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


//https://phdashboard-backend-1.onrender.com   //backend url
//https://phdashboard-frontend.vercel.app/       //frontend url

// Add cookie parser middleware
app.use(cookieParser());


app.use('/ph',router_system);


app.get('/',(req,res)=>{
      return res.status(201).json({success: true , message : "Backend in running"});
})


app.listen(port,()=>{
      console.log("App start on port",`${port}`);
})