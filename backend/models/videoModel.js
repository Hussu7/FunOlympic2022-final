const mongoose=require("mongoose")
const videoSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter video Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter video description"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true, "please enter video category"],
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    
    },
      createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model("Video", videoSchema)