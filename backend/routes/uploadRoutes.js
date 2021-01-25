import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()


const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'uploads/')
    },
    filename(req,file,cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)           //path.extname fetch type extension from filename
    }
})


function checkFileType(file,cb){                              // check if file is image or not
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        return cb(null,true)
    }
    else{
        cb('Images Only')
    }

}

const upload = multer({
    storage,
    fileFilter:function(req,file,cb){                 //filter to allow only images
        checkFileType(file,cb)
    }
})

router.post('/',upload.single('image'),(req,res)=>{                      //can access with name image
    res.send(`/${req.file.path}`)
})                 

export default router