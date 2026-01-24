const Blog = require('../models/Blog')
const slugify = require('slugify')
const { nanoid } = require('nanoid')

exports.addBlog = async (req, res) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    // create readable + unique slug
    const baseSlug = slugify(title, { lower: true, strict: true })
    const uniqueSlug = `${baseSlug}-${nanoid(6)}`

    const blog = await Blog.create({
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
    res.status(500).json({ success: false })
  }
}


