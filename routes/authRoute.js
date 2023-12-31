const express = require('express');
const { createUser, loginUserCtrl, getallUser, getUser, deleteaUser, updatedUser,blockUser,unblockUser, handleRefreshToken, logout } = require('../controllers/userCtrl');
const {authMiddleware,isAdmin} = require('../middlewares/authMidlleware');
const router = express.Router();



router.post("/register",createUser);

router.post("/login",loginUserCtrl);
router.get("/all-users",getallUser);
router.get("/refresh",handleRefreshToken);
router.get('/logout',logout);
router.get("/:id",authMiddleware,isAdmin,getUser);
router.delete("/:id",deleteaUser);
router.put("/edit-user",authMiddleware,updatedUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);





module.exports = router;