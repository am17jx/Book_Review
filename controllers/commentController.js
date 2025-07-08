const catchAsync = require('./../utils/catchAsync');
const pool =require('./../config/DataBase');


exports.CreateComment = catchAsync(async(req,res,next)=>{
    try{
    const {comment_text} = req.body;
    const book_id=req.query.book_id;
    const user_id=req.user.id;
    const add_query = 'INSERT INTO comments (comment_text,book_id,user_id) VALUES ($1,$2,$3) RETURNING *';
    const result= await pool.query(add_query,[comment_text,book_id,user_id])

    res.status(200).json({
        status: 'success',
        data: result.rows
        });
    }
    catch(error){

        error.statusCode = 404;
        error.status = 'fail';
        throw error;
    }


})


exports.getComments = catchAsync(async(req,res,next)=>{
try{
    const get_querey = 'SELECT * FROM comments;'
    const getcomment=await pool.query(get_querey)
    const result = getcomment.rows
    res.status(200).json({
        status: 'success',
        data: result
        });
    }
    catch(error){
        
        error.statusCode = 404;
        error.status = 'fail';
        throw error; }

 })



 exports.updateComment = catchAsync(async(req,res,next)=>{
    try{
    const id=req.params.id;
    const comment_text=req.body.comment_text;
    const query_update = 'UPDATE comments SET comment_text=$1 WHERE id=$2 AND  user_id=$3 RETURNING *'
    const result =await pool.query(query_update,[comment_text,id,req.user.id])
    if(result.rows.length ===0){
        const error = new Error('You do not have permission or comment not found!');
        error.statusCode = 403;
        error.status = 'fail';
        throw error; }
    res.status(200).json({
        status: 'success',
        data: result.rows[0]
        }); 

}  catch (error){
   error.statusCode = 404;
   error.status = 'fail';
   throw error;
        }
 
   });

exports.DeleteComment = catchAsync(async(req,res,next)=>{
    try{
        const id=req.params.id;
        const query_delete = ' DELETE FROM comments WHERE id=$1'
        console.log("befor running delete querey",id)
        const result = await pool.query(query_delete,[id])
   console.log({result})
        if(result.rowCount === 0){
        const error = new Error('You do not have permission or comment  not found!');
        error.statusCode = 403;
        error.status = 'fail';
        throw error; 
    }

    console.log("befor sending response");
    res.status(200).json({
        status: 'success',
        data: null
        });   
}  catch (error){
   error.statusCode = 404;
   error.status = 'fail';
   throw error;
        }
 
   });




 
