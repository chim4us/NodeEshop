//const { expressJwt } = require('express-jwt');
const { expressjwt: expressJwt } = require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    console.log("Applying authJwt middleware...");
    
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            //{url: `${api}/products`, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST','DELETE']},
            `${api}/users/login`,
            `${api}/users/register`
            
        ]
    })
}

async function isRevoked(req,payload,done){
    console.log('Payload:', payload); 
    if(!payload.isAdmin){
        //done(null,true)
        return done(null, true);
    }

    //done()
    return done(null, false);
}

module.exports = authJwt;