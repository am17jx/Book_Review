const catchAsync = require('./../utils/catchAsync');
const pool= require('./../config/DataBase');


exports.GetprofileUser = catchAsync(async(req,res,next)=>{
    //get user Id from JWT
    const userId = req.user.id
   
    const userQuery= 'SELECT id,email FROM users WHERE id=$1 LIMIT 1'
    const result =  await pool.query(userQuery,[userId]);
    const currentUser = result.rows[0];
    
    const numberOfBookQuery = 'SELECT COUNT(*) AS number_of_books FROM books WHERE user_id=$1';
    const resultNumberBook = await pool.query(numberOfBookQuery, [userId]);
    const numberOfBook = parseInt(resultNumberBook.rows[0].number_of_books, 10);

    const numberOfCommentQuery = 'SELECT COUNT(*) AS number_of_comments FROM comments WHERE user_id=$1';
   const resultNumberComment = await pool.query(numberOfCommentQuery, [userId]);
   const numberOfComment = parseInt(resultNumberComment.rows[0].number_of_comments, 10)



    if(!currentUser){

        const error = new Error('Error IN JWT');
        error.statusCode = 404;
       error.status = 'fail';
       throw error;
    }

res.status(200).json({
    status: 'success',
    data:{
      User_Details:currentUser,
        Number_Of_Book:numberOfBook,
        Number_Of_Comments:numberOfComment
    }
    
    }); 
    next();
        });
    