const express=require('express')
const dbcon=require('./app/config/dbcon')
const dotenv=require('dotenv').config()
const cors=require("cors")
var cookieParser = require('cookie-parser')
const flash=require('connect-flash')
const session=require('express-session')
const path=require('path')
const app=express()
dbcon()
app.use(session({
  secret: 'helloworld',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:60000 }
}))
app.use(flash())
app.use(cookieParser())
app.set('view engine','ejs')
app.set('views','views')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const authejs=require('./app/routes/admin/authejs')
app.use(authejs)
const bannerejs=require('./app/routes/admin/bannerroute')
app.use(bannerejs)
const aboutejs=require('./app/routes/admin/aboutejsroute')
app.use(aboutejs)
const contactejs=require('./app/routes/admin/contactejsroute')
app.use(contactejs)
const testimonialjs=require('./app/routes/admin/testimoniale')
app.use(testimonialjs)
const packagejs=require('./app/routes/admin/packageroute')
app.use(packagejs)
const coachejs=require('./app/routes/admin/coachejsroute')
app.use(coachejs)
const clientejs=require('./app/routes/admin/clientejsroute')
app.use(clientejs)
const blogejs=require('./app/routes/admin/Blogroutes')
app.use(blogejs)
const authroute=require('./app/routes/api/AuthRouter')

app.use('/api',authroute)
app.use('/api/coach', require('./app/routes/api/CoachRouter'));
app.use('/api', require('./app/routes/api/blogapiroute'));
app.use('/api/clients', require('./app/routes/api/Clientroute'));
const mealRoutes = require("./app/routes/api/Mealroute");
const programRoutes = require("./app/routes/api/programRoutes");
const assignmentRoutes = require("./app/routes/api/AssignmentRoutes");

const messageRoutes = require("./app/routes/api/ChatRouter");
// const paymentRoutes = require("./routes/paymentRoutes");
const teamRoutes = require("./app/routes/api/Teamroute");
app.use("/api/meals", mealRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/roles", require("./app/routes/api/roleRoutes"));
app.use("/api/workspaces", require("./app/routes/api/Workspaceroute"));
app.use("/api/messages", messageRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/teams", teamRoutes);
port=3005
app.listen(port,()=>{
    console.log(`server running on ${port}`);
    
})