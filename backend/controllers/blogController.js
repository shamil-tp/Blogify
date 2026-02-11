const Blog = require('../models/Blog')
const slugify = require('slugify')
const { nanoid } = require('nanoid')

exports.addBlog = async (req, res) => {

  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  const userId = req.user._id

  if (!userId) {
    return res.status(401).json({ message: 'user not found in db' })
  }

  const baseSlug = slugify(title, { lower: true, strict: true })

  const uniqueSlug = `${baseSlug}-${nanoid(6)}`

  try {
    const blog = await Blog.create({
      author: userId,
      title,
      slug: uniqueSlug,
      content
    })

    res.status(201).json(blog)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getBlog = async (req, res) => {
  try {
    const { slug } = req.params

    const blog = await Blog.findOne({ slug })

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      })
    }

    res.status(200).json({
      success: true,
      blog
    })

  } catch (err) {
    console.error("ERROR:", err)
    res.status(500).json({
      success: false,
      message: 'the error is server error',
      error: err
    })
  }
}


exports.getUserBlogs = async (req, res) => {
  try {
    const userId = req.user._id

    if (!userId) {
      return res.status(401).json({ message: 'user not found' })
    }

    const userBlogs = await Blog.find({
  author: userId,
  published: true
})

    if (!userBlogs) {
      return res.status(401).json({ message: "no blogs found" })
    }

    return res.status(200).json({ message: 'blogs found', success: true, blogs: userBlogs })

  } catch (e) {
    console.log('error while finding from db')
    console.log(e)
    return res.status(501).json({ message: 'error from backend', error: e })
  }
}

exports.deleteUserPost = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.user._id

    if (!postId) {
      return res.status(401).json({ message: 'error post id not found' })
    }

    if (!userId) {
      return res.status(401).json({ message: 'user not available' })
    }

    let result = await Blog.deleteOne({ _id: postId, author: userId })

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Successfully deleted the blog post." })
    } 
    else {
      console.log("No post found with that ID or you are not the author.");
      res.status(401).json({ message: "No post found with that ID or you are not the author." })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'error from backend', error: e })
  }
}

// exports.getBlogById = async (req, res) => {
//   try {
//     let blogId = req.params.postId
//     const blog = await Blog.findOne({ _id: blogId })

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found"
//       })
//     }

//     res.status(200).json({
//       success: true,
//       blog
//     })

//   } catch (e) {
//     console.log(e)
//     return res.status(500).json({ message: 'error from backend', error: e })
//   }
// }

exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.postId;

    if (!blogId || blogId === "null") {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (e) {
    res.status(500).json({ message: "error from backend", error: e });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const blogId = req.params.postId;
    const userId = req.user._id;

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, author: userId },
      {
        title,
        content,
        published: published ?? false 
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found or unauthorized" });
    }

    res.status(200).json({ success: true, blog });
  } catch (e) {
    res.status(500).json({ message: "Update failed", error: e });
  }
};


exports.createDraft = async (req, res) => {
  const blog = await Blog.create({
    author: req.user._id,
    title: '',
    published: false,
    slug: slugify(`draft-${Date.now()}`, { lower: true }),
    content: []
  })

  res.json({ blog })
}