class ApiError extends Error{
    constructor(
        statuscode,
        message="Something Went Wrong!",
        errors=[]
    ){
        super(message)
        this.statuscode=statuscode,
        this.message=message,
        this.data=null,
        this.errors=errors
    }
}

export {ApiError}