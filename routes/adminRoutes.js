require('dotenv').config()
const express = require('express');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { isAdminLoggedIn } = require('../middleware/loginChecking/checkingAdminSession');
const { getAdminDashboard, getAdminLogin, getAdminUsers, getUserBlock, postAdminLogin, getUserUnblock, getShowProduct, getShowCategory, getShowSpecificCategory, getAddProducts, getEditProduct, postDeleteProduct, getAddBanner, postAddProduct, postEditProduct, postAddCategory, postAddBanner, getShowOrders, getShowCoupon, getDetailsOfEachOrders } = require('../controllers/adminController');


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/commonStatic/productImages")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({
    storage: fileStorageEngine
})


router.route('/').get(isAdminLoggedIn, getAdminLogin).post(postAdminLogin)
router.route('/showDashboard').get(isAdminLoggedIn, getAdminDashboard)
router.route('/showUsers').get(isAdminLoggedIn, getAdminUsers)
router.route('/blockUser/:id').get(isAdminLoggedIn, getUserBlock)
router.route('/unBlockUser/:id').get(isAdminLoggedIn, getUserUnblock)
router.route('/showProducts').get(isAdminLoggedIn, getShowProduct)
router.route('/showCategory').get(isAdminLoggedIn, getShowCategory)
router.route('/showSpecificCategory/:id').get(isAdminLoggedIn, getShowSpecificCategory)
router.route('/addProduct').get(isAdminLoggedIn, getAddProducts).post(isAdminLoggedIn, upload.array('productImages'), postAddProduct)
router.route('/editProduct/:id').get(isAdminLoggedIn, getEditProduct).post(upload.array('productImages'), postEditProduct)
router.route('/deleteProduct/:id').post(isAdminLoggedIn, postDeleteProduct)
router.route('/addBanner').get(isAdminLoggedIn, getAddBanner).post(upload.single('bannerImage'), postAddBanner)
router.route('/addCategory').post(upload.single('categoryImage'), postAddCategory)
router.route('/showOrder').get(getShowOrders)
router.route('/showCoupon').get(getShowCoupon)
router.route('/showOrderDetailes/:userId/:orderId').get(getDetailsOfEachOrders)



module.exports = router