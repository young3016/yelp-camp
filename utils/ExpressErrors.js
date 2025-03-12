class ExpressError extends Error {
    constructor(message, statusCode){
        super(message); // ✅ super(message) 추가 추천
        this.statusCode = statusCode;
    }
}
