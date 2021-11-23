module.exports = (mongoose) => {
    const userSchema = new mongoose.Schema({
        login:      String,
        firstName:  String,
        lastName:   String,
        password:   {
            type:   String,
            default:"123456"
        }
    });

    return mongoose.model('User', userSchema);
}