const catchAsync = require('./../utils/catchAsync');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool= require('./../config/DataBase');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '10h'
    });
  };
 

exports.signup = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    

    if (!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
       error.status = 'fail';
       throw error;   
     }  
     
     if (password.length < 8) { 
     const error = new Error('Password must be at least 8 characters long');
     error.statusCode = 400;
    error.status = 'fail';
    throw error;
      }

    const checkEmail  = await pool.query('SELECT email FROM users WHERE email=$1',[email])
    if (checkEmail.rows.length > 0){
        
        const error = new Error('email is already exists');
        error.statusCode = 400;
       error.status = 'fail';
       throw error;  
      }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const signupQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(signupQuery, [email, hashedPassword]);
  
    const newUser = result.rows[0];
    newUser.password = undefined;
 const token = signToken(newUser.id);

 res.status(201).json({
          status: 'success',
          token,
          data: {
            newUser
          }
        })
  });

  


exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} =  req.body;
    if (password.length < 8) { 
        const error = new Error('Password must be at least 8 characters long');
        error.statusCode = 400;
       error.status = 'fail';
       throw error;
         }

    if (!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
       error.status = 'fail';
       throw error;   
     }  
     

    const user_query = 'SELECT id, email, password FROM users WHERE email = $1 LIMIT 1';
    const result = await pool.query( user_query,[email]);
    const user =result.rows[0];


    const matchpassword  = await bcrypt.compare(password,user.password);

    if(!user || !matchpassword){
        const error = new Error('Incorrect email or password');
        error.statusCode = 401;
       error.status = 'fail';
       throw error;
    }
    
   
        user.password = undefined;

    const token = signToken(user.id);

    res.status(200).json({
             status: 'success',
             token,
             data: {
                user
             }
           })
     });
   



exports.protect=catchAsync(async(req,res,next)=>{

    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
} catch (error) {
    res.status(400).json({ error: 'Invalid Token' });
}
});



exports.ChechRole = catchAsync(async(req,res,next)=>{
  const id =req.user.id;
  const id_query='SELECT role FROM users WHERE id=$1;'
  const result_query =await pool.query(id_query,[id])
  const role = result_query.rows[0]?.role;  

  if(role !=='admin'){
    const error = new Error('you dont have permission to do this action !');
        error.statusCode = 401;
       error.status = 'fail';
       throw error;


  }
  next();
  


})

 





