# API List for devTinder

## AuthRouter
POST /singup
POST /singin
POST /logout

## ProfileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## ConnectionRequestRouter
POST /request/send/interested:userId
POST /request/send/ignored:userId
POST /request/review/accepted: requestId
POST /request/review/rejected: requestId

## UserRouter
get /user/connections
get /user/requestes/recieved
get /user/feed

