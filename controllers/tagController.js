const catchAsync = require('./../utils/catchAsync');
const pool =require('./../config/DataBase')



exports.addtags = catchAsync(async(req,res,next)=>{
    try{
    const book_id = req.params.book_id;
    const user_id  = req.user.id;
    const {tag}= req.body;
    //check book if exist
    const book_querey = 'SELECT user_id FROM books WHERE id = $1'
    const result_book = await pool.query(book_querey,[book_id])
    if(result_book.rowCount===0){
        const error = new Error('Book not found!');
        error.statusCode = 404;
        error.status = 'fail';
        return next(error);}

    const OwnerBookId =  result_book.rows[0].user_id;   
  if(Number(OwnerBookId) !== Number(user_id)){
        const error = new Error('You are not the author of this book!');
        error.statusCode = 403;
        error.status = 'fail';
        return next(error);
    }
  
    const enumQuery = `SELECT unnest(enum_range(NULL::type_tag)) AS tag;`;
    const result = await pool.query(enumQuery);
    const validTags = result.rows.map(row => row.tag);  
    

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
   await pool.query(add_tag_querey,[book_id,tagId])

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




exports.updatetag =catchAsync(async(req,res,next)=>{
    try {
    const book_id=req.params.book_id
    const tag_Id=req.params.tag_Id;
    const tag = req.body.tag;

    const book_querey = 'SELECT user_id FROM books WHERE id = $1'
    const result_book = await pool.query(book_querey,[book_id])
    if(result_book.rowCount===0){
        const error = new Error('Book not found!');
        error.statusCode = 404;
        error.status = 'fail';
        return next(error);

    }

    const userId = req.user.id;
if (result_book.rows[0].user_id !== userId) {
  return res.status(403).json({
    status: 'fail',
    message: 'You do not have permission to update this book'
  });
}
      const enumQuery = `SELECT unnest(enum_range(NULL::type_tag)) AS tag;`;
      const result = await pool.query(enumQuery);
      const validTags = result.rows.map(row => row.tag);  
          
    if (validTags.includes(tag)) {
   const tagId_query = 'SELECT id FROM tags WHERE tag=$1;'
   const tagIdResult = await pool.query(tagId_query, [tag]);
   if (tagIdResult.rowCount === 0) {
     return res.status(400).json({
       status: 'fail',
       message: `Tag "${tag}" not found in tags table`
     });
   }
   const newTagId = tagIdResult.rows[0].id;

  const update_tag_querey =('UPDATE book_tag SET tag_id = $1 WHERE book_id = $2 AND tag_id = $3 RETURNING *;');
  await pool.query(update_tag_querey,[newTagId,book_id,tag_Id])

  const query_name_tag = 'SELECT tag FROM tags WHERE id=$1;'
  const tags_result = await pool.query(query_name_tag,[newTagId]) 
        
  res.status(200).json({
    status: 'success',
    tag: tags_result.rows[0]       

    });  
    }
}

catch (error){
    error.statusCode = 404;
        error.status = 'fail';
        throw error;
}
});


exports.deletetag =catchAsync(async(req,res,next)=>{

    const tagId=req.params.tagId;
    const bookId=req.params.bookId;
    const query_delete = ' DELETE FROM book_tag WHERE tag_id = $1 AND book_id = $2 '
    const result = await pool.query(query_delete,[tagId,bookId])
 
    if(result.rowCount === 0){
        const error = new Error('You do not have permission or tag  not found!');
        error.statusCode = 403;
        error.status = 'fail';
        throw error; 
    }
    res.status(200).json({
        status: 'success',
        data: null
        }); 

    
}
    
    
)


exports.addNewTag =catchAsync(async(req,res,next)=>{
    try{
    const tag = req.body.tag; 
    const query = `ALTER TYPE type_tag ADD VALUE IF NOT EXISTS ${tag}`;
    await pool.query(query);

    const insert_tag_query =' INSERT INTO tags (tag) VALUES ($1);'
    await pool.query(insert_tag_query,[tag]);

    const all_tag = 'SELECT * FROM tags ORDER BY tag DESC LIMIT 1'
    const tags = await pool.query(all_tag);
    const result = tags.rows[0]
    
    
    res.status(200).json({
        status: 'success',
        tag: result   
    
        });

    }
    catch(error){

        error.statusCode = 404;
        error.status = 'fail';
        throw error;
    }
    
})

exports.getalltags = catchAsync(async(req,res,next)=>{
    try{
    const get_all_tag_query = 'SELECT * FROM tags'
    const get_all_tag = await pool.query(get_all_tag_query);
    const result = get_all_tag.rows
    
     res.status(200).json({
        status: 'success',
        tag: result   
    
        });
}
    
    catch(error){
        error.statusCode = 404;
        error.status = 'fail';
        throw error;
    }
})




exports.deletetypetag=catchAsync(async(req,res,next)=>{
    try {
    const id = req.params.id; 
    const query = 'DELETE FROM tags WHERE id=$1';
   const res_querey =  await pool.query(query,[id]);
   const result =res_querey.rows
    
    res.status(200).json({
        status: 'success',
        data: result
        });
    }
        catch(error) {
            error.statusCode = 404;
            error.status = 'fail';
            throw error;

        }
    
}
    
    
)




