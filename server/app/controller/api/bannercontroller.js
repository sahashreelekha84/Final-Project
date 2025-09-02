const BannerModel = require("../../model/bannermodel");
const ErrorCode = require("../../helper/httpsServerCode");



class BannerApiController{

    //create product

    async createbanner(req,res){
         console.log(req.file,req.files);
        try{
            
            const{title,subtitle}=req.body
          
            
            const Banner=new BannerModel({
                title,subtitle
            })
           
            if(req.file){
                    Banner.image=req.file.path
                    
                }
                   
      
            const data=await Banner.save()
             
            return res.status(ErrorCode.Create).json({
                status:true,
                message:"banner create successfully",
                data:data
            })
            
        }
        catch (error) {
            console.error(error); 
           return res.status(ErrorCode.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }
   //get all banner
   async bannerlist(req,res){
    try{
        //console.log(req.body);
       const Banner=await BannerModel.find({isDeleted: false})

        return res.status(ErrorCode.Ok).json({
            status:true,
            message:"get all Banner successfully",
            total:Banner.length,
            data:Banner
        })
        
    }catch(error){
        return res.status(ErrorCode.InternalServerError).json({
            status:false,
            message:error.message
        })
    }
}

//for get single data
async editbanner(req,res){
    try{
        const id=req.params.id

       const edit=await BannerModel.findById(id)

        return res.status(ErrorCode.Success).json({
            status:true,
            message:"get single data",
            data:edit
        })
        
    }catch(error){
        return res.status(ErrorCode.InternalServerError).json({
            status:false,
            message:error.message
        })
    }
}



//for update
async Updatebanner(req, res) {
try {
  const id = req.params.id;

  const updatedStudent = await BannerModel.findByIdAndUpdate(id, req.body, {
    new: true 
  });

  return res.status(ErrorCode.Create).json({
    status: true,
    message: "Banner updated successfully",
    data: updatedStudent 
  });

} catch (error) {
  return res.status(ErrorCode.InternalServerError).json({
    status: false,
    message: error.message
  });
}
}



//for delete
async deletebanner(req,res){
    try{
        const id=req.params.id
        
       await BannerModel.findByIdAndDelete(id)

        return res.status(ErrorCode.Create).json({
            status:true,
            message:"banner delete successfully",
        
        })
        
    }catch(error){
        return res.status(ErrorCode.InternalServerError).json({
            status:false,
            message:error.message
        })
    }
}
}






module.exports=new BannerApiController()


