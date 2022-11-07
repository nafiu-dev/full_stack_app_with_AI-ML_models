const router = require('express').Router()

// Models
const Post = require('../models/Post')
const User = require('../models/User')
// MIDDLEWARE
const verifyAuth = require('../middleware/verifyAuth')



// GET | /api/v1/posts | public | get all posts 
router.get('/posts', async (req, res) => {
    try {
        // populate
        const posts = await Post.find().populate('comments').populate('posted_by') 

        return res.status(200).json({
            data: posts,
            success: true
        })
    } catch (error) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

// GET | /api/v1/followers-posts | private | get all posts from the users that logged in user follow
router.get('/followers-posts', verifyAuth, async (req, res) => {

    try {
        const get_user = await User.findById(req.user.id)

        // populate
        const posts  = await Post.find({UserId: get_user.following}).populate('comments').populate('posted_by')

        res.status(200).json({
            data: posts,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})


// GET | /api/v1/post/:id | public | get a single post by id
router.get('/post/:id', async (req, res) => {
    try {
        const post  = await Post.findById(req.params.id).populate('comments')



        if(!post){
            res.status(400).json({success: false})
        }
        
        res.status(200).json({
            data: post,
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})



// POST | /api/v1/add-new| private | add a new post
router.post('/add-new', verifyAuth, async (req, res) => {
    try {

        const newPost = await Post.create({
            UserId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            post_image: req.body.image_url,
        })

        res.status(200).json({
            data: newPost,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

// PUT | /api/v1/post/edit-post/:id| Private | Edit a post
router.put('/edit-post/:id', verifyAuth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(400).json({
                success: false
            })
        }

        if(!post.UserId == req.user.id){
            return res.status(400).json({
                success: false
            })
        }else{
            await post.update({   
                UserId: req.user.id,
                title: req.body.title,
                description: req.body.description,
                post_image: req.body.image_url,
            })
        }

        res.status(200).json({ 
            success: true,
            data: {}
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})

// DELETE | /api/v1/post/delete-post/:id | Private | delete a post
router.delete('/delete-post/:id',verifyAuth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(400).json({
                success: false
            })
        }
        
        if(!post.UserId == req.user.id){
            return res.status(400).json({
                success: false
            })
        }else{
            await post.delete()
        }
        
        res.status(200).json({ 
            success: true,
            data: {}
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
})




module.exports = router 

