module.exports = (request, response, next) => {
    response.setheader("Access-Control-Allow-Origin", "*");
    next();
};
