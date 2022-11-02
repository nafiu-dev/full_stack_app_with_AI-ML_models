const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const verifyAuth = require('../middleware/verifyAuth')

// POST | /api/v1/register | public | register user
router.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body
        
        
        if(!name || !email || !password) {
            res.status(400).json({
                msg: 'please fill the required fields',
                success: false
            })
        }
        
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({ 
                msg: 'user already exists',
                success: false
            })
        }
        
        
        user = new User({
            name,
            email,
            password
        })
        
        const slat = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, slat)
        await user.save()
        
        
        // paylaod || {id: user._id}
        jwt.sign({id: user._id}, process.env.JWT_SECTET, {
            expiresIn: 36000 
        }, (err, token) => {
            if(err) throw err
            res.status(200).json({
                token
            })
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})


// POST api/v1/login | public | login exixting user
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        if( !email || !password){
            return res.status(400).json({ 
                msg: 'invalid credentials',
                success: false 
            })
        }

        let user = await User.findOne({email}).select('+password')
        if(!user ) return res.status(400).json({
            msg: 'invalid credentials',
            success: false 
        })

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch ) return res.status(400).json({ 
            msg: 'invalid credentials',
            success: false 
        })

        jwt.sign({id: user._id}, process.env.JWT_SECTET, {
            expiresIn: 36000 
        }, (err, token) => {
            if(err) throw err
            res.status(200).json({
                token
            })
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

// GET api/v1/user | private | get logged in user for the process of auth
router.get('/user', verifyAuth,  async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            // deep populate
            path: 'posts',
            populate : {
                path : 'comments'
            }
        })
        res.status(200).json({
            user,
            success: true
        }) 
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg:'SERVER ERROR'})
    }
})

module.exports = router 