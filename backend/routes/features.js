const router = require('express').Router()

const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')

const verifyAuth = require('../middleware/verifyAuth')


// GET | /api/v1/post/like/:id| Private | Like a post
router.get('/like/:id', verifyAuth, async (req, res) => {
    try {
        const liked = await Post.updateOne(
            {
                _id: req.params.id
            },
            {
                $push: {
                    likes:  req.user.id 
                }
            }
            )
            
            
            if(!liked){
                return res.status(401).json({success: false})
            }
            
            res.status(200).json({success: true})
            
        } catch (err) {
            console.log(err)
            res.status(400).json({success: false})
        }
    })
    
// GET | /api/v1/post/unlike/:id| Private | unlike a post
router.get('/unlike/:id', verifyAuth, async (req, res) => {
    try {
        const liked = await Post.updateOne(
            {
                _id: req.params.id
            },
            {
                $pull: {
                    likes:  req.user.id 
                }
            }
            )
            
            if(!liked){
                return res.status(401).json({success: false})
            }
            
            
            res.status(200).json({success: true})
            
        } catch (err) {
            console.log(err)
            res.status(400).json({success: false})
        }
    })
    
    
    
// GET | /api/v1/post/follow/:id| Private | follow a User
router.get('/follow/:id', verifyAuth, async (req, res) => {
    try {
        const followed = await User.updateOne(
            {
                _id: req.user.id 
            },
            {
                $push: {
                    following:  req.params.id 
                }
            }
        )
    
        const followersAdded = await User.updateOne(
            {
                _id: req.params.id
            },
            {
                $push: {
                    followers:  req.user.id
                }
            }
        
        )
        
        if(!followed || !followersAdded){
            return res.status(401).json({success: false})
        }
        
        res.status(200).json({success: true})
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})
        
        
// GET | /api/v1/post/unfollow/:id| Private | unfollow a User
router.get('/unfollow/:id', verifyAuth, async (req, res) => {
    try {
        const followFixed = await User.updateOne(
            {
                _id: req.user.id 
            },
            {
                $pull: {
                    following:  req.params.id 
                }
            }
        )
            
        const followersFixed = await User.updateOne(
            {
                _id: req.params.id
            },
            {
                $pull: {
                    followers:  req.user.id
                }
            }

        )

        if(!followFixed || !followersFixed){
            return res.status(401).json({success: false})
        }

        res.status(200).json({success: true})
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

// GET | /api/v1/post/profile/:id| public | get a users profile by iD
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            // deep populate
            path: 'posts',
            populate : {
                path : 'comments'
            }
        })
        if(!user){
            return res.status(401).json({success: false})
        }
        res.status(200).json({
            data: user,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

// GET | /api/v1/post/comment/:id| Private | add a comment to a post
router.post('/post/comment/:id', verifyAuth,async (req, res) => {
    try {
        const comment = await Comment.create({
            PostId: req.params.id,
            comment: req.body.comment,
            UserId: req.user.id,
        })
        
        if (!comment) {
            return res.status(400).json({
                success: false
            })
        }

        
        res.status(200).json({
            data: comment,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

module.exports = router 