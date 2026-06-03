class ApiResponse {
    constructor(statusCode, data, message="All good"){

        this.statuscode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400    // Evaluates to true only for successful HTTP statuses (200-399)
    }
}

export {ApiResponse}