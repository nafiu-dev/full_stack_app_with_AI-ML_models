const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    following: {
        type: Array
    },
    followers: {
        type: Array
    },
    created_at:{
        type: String,
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

UserSchema.pre('save', async function (next) {
    let date_info = new Date
    let date_into = date_info.getDate() + '/' + (date_info.getMonth()+1) + '/' +  date_info.getFullYear()
    this.created_at = await date_into
})

UserSchema.virtual('posts', {
    ref: 'post',
    localField: '_id',
    foreignField: 'UserId',
    justOne: false
})

module.exports = mongoose.model('user', UserSchema)
