import {ApiError} from "../utils/ApiError.js";


const errorHandler = (err, req, res, next) =>{
    let statuscode;
    let message;

    if(err instanceof ApiError){
        statuscode = err.statuscode;
        message = err.message;
    }else{
        statuscode = 500;
        message = "Internal Server Error!";
    }

    return res.status(statuscode)
    .json({
        success: false,
        statuscode: statuscode,
        message: message
    })
}

export {errorHandler}