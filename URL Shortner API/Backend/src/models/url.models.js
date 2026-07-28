import mongoose, {Schema} from "mongoose" ;

const urlSchema = new Schema({
    longUrl:{
        type:String,
        required:true,
        unique:true
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true
    },
    click:{
        type:Number,
        default: 0
    }
}, {timestamps: true})

export const Url = mongoose.model("Url", urlSchema)