const catchAsync = require('./../utils/catchAsync');
const pool =require('./../config/DataBase')
       
exports.getallbooks = catchAsync(async(req,res,next)=>{

    const { user_id } = req.query;
 
     try{
        if(!user_id){
              const get_querey = `
              SELECT 
  books.id AS book_id, 
  books.book_name, 
  users.id AS user_id, 
    users.email,
    COALESCE(
    json_agg(DISTINCT comments.comment_text) 
    FILTER (WHERE comments.comment_text IS NOT NULL), '[]'
     ) AS comments,
      COALESCE(
      json_agg(DISTINCT tags.tag)
      FILTER (WHERE tags.tag IS NOT NULL), '[]'
         ) AS tags
    FROM books
    LEFT JOIN users ON books.user_id = users.id
    LEFT JOIN comments ON books.id = comments.book_id
    LEFT JOIN book_tag ON books.id = book_tag.book_id
    LEFT JOIN tags ON book_tag.tag_id = tags.id
    GROUP BY books.id, books.book_name, users.id, users.email
    ORDER BY books.id DESC;
    `
              
              const result_books = await pool.query(get_querey);
                res.status(200).json({
                status: 'success',
                data:result_books.rows});
            }

            if(user_id){
            const user_id=req.query.user_id;
            const querey_FindBookuser = 
            ` SELECT 
  books.id AS book_id, 
  books.book_name, 
  users.id AS user_id, 
    users.email,
    COALESCE(
    json_agg(DISTINCT comments.comment_text) 
    FILTER (WHERE comments.comment_text IS NOT NULL), '[]'
     ) AS comments,
      COALESCE(
      json_agg(DISTINCT tags.tag)
      FILTER (WHERE tags.tag IS NOT NULL), '[]'
         ) AS tags
    FROM books
    LEFT JOIN users ON books.user_id = users.id
    LEFT JOIN comments ON books.id = comments.book_id
    LEFT JOIN book_tag ON books.id = book_tag.book_id
    LEFT JOIN tags ON book_tag.tag_id = tags.id
    WHERE books.user_id = $1
    GROUP BY books.id, books.book_name, users.id, users.email
    ORDER BY books.id DESC; `

            const result = await pool.query(querey_FindBookuser,[user_id]); 
        res.status(200).json({
            status: 'success',
            data:result.rows
        })
    }
}
catch(error){
    error.statusCode = 500;
    error.status = 'fail';
    return next(error); 
} });
    

   exports.deletebook = catchAsync(async(req,res,next)=>{
    try{
    const id=req.params.id;
    const delete_querey = 'DELETE FROM books WHERE id=$1 AND user_id = $2;'
    const result= await  pool.query(delete_querey,[id,req.user.id]);
     if (result.rowCount === 0) {
        const error = new Error('You do not have permission or book not found!');
        error.statusCode = 403;
        error.status = 'fail';
        throw error;
      }
res.status(200).json({
    status: 'success',
    data: null
    }); }

    catch(error){
        error.statusCode = 404;
       error.status = 'fail';
       throw error;
    }
    next(); });


   
exports.updatebook = catchAsync(async(req,res,next)=>{
    try{
    const id=req.params.id;
    const book_name=req.body.book_name;
    const update_querey = 'UPDATE books SET book_name=$1 WHERE id =$2 AND user_id = $3 RETURNING *'
    const result = await pool.query(update_querey,[book_name,id,req.user.id])
    if (result.rows.length === 0) {
        const error = new Error('You do not have permission or book not found!');
        error.statusCode = 403;
        error.status = 'fail';
        throw error;
      }
res.status(200).json({
    status: 'success',
    data: result.rows[0]
    }); 
}

catch (error){
    error.statusCode = 404;
   error.status = 'fail';
   throw error;
} 
next();

        });

  exports.addbook = catchAsync(async(req,res,next)=>{
    try {

    const {book_name,tag}=req.body;
    const user_id = req.user.id; 
    const add_book_querey =('INSERT INTO books (book_name, user_id) VALUES ($1,$2)  RETURNING  *');
    
    const result_book = await  pool.query(add_book_querey,[book_name,user_id])
    const bookId = result_book.rows[0].id;
    
        //to select enum tag
    const enumQuery = `SELECT unnest(enum_range(NULL::type_tag)) AS tag;`;
    const result = await pool.query(enumQuery);
    const validTags = result.rows.map(row => row.tag);  
    

    //check if tag in req.body in enum tags
    if (validTags.includes(tag)) {
   const tagId_query = 'SELECT id FROM tags WHERE tag=$1;'
   const result_id = await pool.query(tagId_query, [tag]);
   const tagId = result_id.rows[0]?.id;
   if (!tagId) {
    return res.status(400).json({
      status: 'fail',
      message: `Tag "${tag}" not found in tags table`
    });
  }
  
   const add_tag_querey =('INSERT INTO book_tag (book_id,tag_id) VALUES ($1,$2)  RETURNING  *');
   await pool.query(add_tag_querey,[bookId,tagId])
   const query_name_tag = 'SELECT tag FROM tags WHERE id=$1;'
   const tags_result = await pool.query(query_name_tag,[tagId]) 
    res.status(200).json({
            status: 'success',
            book: result_book.rows[0],
            tag: tags_result.rows       
        
            });
      }
      else {  
          //if not exist show to user avalible tags and give him error 
        const error = new Error(`YOU CAN ADD JUST THESE TAG ${validTags} PLEASE TRY AGEIN`);
        error.statusCode = 404;
        error.status = 'fail';
        throw error;
      } }
        catch(error){
            error.statusCode = 404;
           error.status = 'fail';
           throw error;
        } 
        next();

        
         });





  

