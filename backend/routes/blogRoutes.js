
import express from "express";
import { googleLogin } from "../controllers/auth.controller.js";

const router = express.Router();

routes
    .route('/viewblog/:slug')
    .get(getBlog)
routes
    .route('/postblog')
    .post(addBlog)

router.post("/google", googleLogin);


export default router;





