function errorHandler(err, req,res,next){

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({
            success: false,
            message: "The user is not authorized",
            Error: err
        })
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({
            success: false,
            message: err
        })
    }

    // default to 500 server error
    return res.status(500).json(err);

    if(err){
        return res.status(500).json({
            success: false,
            message: 'There is error in the server',
            Error: err
        })
    }
}

module.exports = errorHandler;