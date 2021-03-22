module.exports = {
    checkRequest : async (req,res, next) => {
        var rRequestheader = req.headers['user-agent']; 
        if(rRequestheader.includes('UnityPlayer')) {
            next();
        } else {
            res.status(500).send('Something broke!')
        }
    }
}

