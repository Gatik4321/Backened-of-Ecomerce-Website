//  this will creating a try and catch block that is basically used to handle the error
module.exports= theFunc=>(req,res,next)=>{
      Promise.resolve(theFunc(req,res,next)).catch(next);
}