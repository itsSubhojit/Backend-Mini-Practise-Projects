import { Url } from "../models/url.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";
import validator from "validator";



const shortenUrl = asyncHandler(async(req, res) =>{
    const {longUrl} = req.body
    if(!longUrl){
        throw new ApiError(400, "longUrl field can't ne empty")
    }

    const optionsUrl = {
        require_protocol: true,
        require_host: true
    }
    const isValidUrl = validator.isURL(longUrl, optionsUrl);
    if(!isValidUrl){
        throw new ApiError(400, "Invalid Url!");
    }

    const existLongUrl = await Url.findOne({longUrl})
    if(existLongUrl){
        return res.status(200)
        .json(new ApiResponse(200, existLongUrl.shortUrl, "ShortUrl Generated...")) 
    }

    const shortUrl = await nanoid(10)
    const saveShortUrl = await Url.create({
        longUrl: longUrl,
        shortUrl: shortUrl
    })
    return res.status(200)
    .json(new ApiResponse(201, saveShortUrl, "New ShortUrl Generated..."))
    
})


export {shortenUrl}