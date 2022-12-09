
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay')
const instance = new Razorpay({ key_id: 'rzp_test_nskbaOm2bho9QL', key_secret: 'hC8hOtH65DFfZ52JZgcuuTrc' })
var ObjectId = require('mongodb').ObjectID;


const User = require('../models/userModel');
const { validatingUserRegisterPartOne, validatingUserRegisterPartTwo } = require('../middleware/validation/userRegister');
const { validatingUserLoginPartOne, validatingUserLoginPartTwo } = require('../middleware/validation/userLogin');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const { getMainPage, getShop, getRegister, getLogin, getOtpVerify, getShopingSingle, getCart, getSelectAddressAndPayment, getProfile, getRemoveItemFromCart, getOrders, getOrderPlacedStatus, getWishlist, getAbout, postUpdateOrderStatus, getFilterByCategory, postRegister, postVerifyOtp, postLogin, postAddToCArt, postChangeProductQuantity, postAddAddress, postOrderPlaced, postWishList, postVerifyPayment, getEditProfile, postEditProfile, getAddToCartFromWishlist, getRemoveAddress, getRemoveItemFromWishlist, postApplyCoupon, getUserLogout, getRemoveBanner } = require('../controllers/userController');
const Banner = require('../models/bannerModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel');
const { default: mongoose } = require('mongoose');
const Category = require('../models/categoryModel');






router.route('/').get(getMainPage)
router.route('/register').get(getRegister)
router.route('/otpVerify').get(getOtpVerify).post(postVerifyOtp)
router.route('/login').get(getLogin).post(validatingUserLoginPartOne, validatingUserLoginPartTwo, postLogin)
router.route('/shop').get(getShop)
router.route('/shopSingle/:id').get(getShopingSingle)
router.route('/cart').get(getCart)
router.route('/profile').get(getProfile)
// router.route('/selectAddressAndPayment').get(getSelectAddressAndPayment)
router.route('/removeItemFromCart/:id').get(getRemoveItemFromCart)
router.route('/removeItemFromWishlist/:id').get(getRemoveItemFromWishlist)
router.route('/orders').get(getOrders)
router.route('/orderPlacedStatus').get(getOrderPlacedStatus)
router.route('/wishlist').get(getWishlist)
router.route('/about').get(getAbout)
router.route('/filterByCategory/:categoryId').get(getFilterByCategory)
router.route('/addToCart/:id').post(postAddToCArt)
router.route('/changeProductQuantity').post(postChangeProductQuantity)
router.route('/addAddress/:cartTotal').post(postAddAddress)
router.route('/selectAddressAndPayment/:total').get(getSelectAddressAndPayment)
router.route('/orderPlaced').post(postOrderPlaced)
router.route('/wishlist/:id').post(postWishList)
router.route('/verifyPayment').post(postVerifyPayment)
router.route('/editProfile').get(getEditProfile).post(postEditProfile)
router.route('/addToCartFromWishlist/:id').get(getAddToCartFromWishlist)
router.route('/removeAddress/:id/:cartTotal').get(getRemoveAddress)
router.route('/updateOrderStatus/:userId/:orderId').post(postUpdateOrderStatus)
router.route('/register').post(validatingUserRegisterPartOne, validatingUserRegisterPartTwo, postRegister)
router.route('/applyCoupon').post(postApplyCoupon)
router.route('/logout').get(getUserLogout)
router.route('/removeBanner/:id').get(getRemoveBanner)












router.get('/testing', async (req, res) => {

    const userName = req.session.loggedUserName
    const userId = req.session.loggedUserId
    const numberOfProductsInCart = await Cart.find({ userId: userId })
    if ((numberOfProductsInCart).length > 0) {
        cartLength = numberOfProductsInCart[0].products.length
    } else {
        cartLength = 0
    }

    const lastOrderOfUser = await Order.aggregate([
        {
            '$match': {
                'userId': ObjectId('636bbd026108a89aa317c428')
            }
        },
        {
            '$unwind': {
                'path': '$orders'
            }
        }, {
            '$sort': {
                'orders': -1
            }
        }
    ])

    const detailesOfLastOrderOfUser = lastOrderOfUser[0].orders
    console.log(detailesOfLastOrderOfUser);




    res.render('userFiles/orderPlaced', { user: true, usersName: userName, userId, cartLength, detailesOfLastOrderOfUser })
})





// router.get('/', async (req, res) => {
//     const allBanners = await Banner.find({})
//     console.log(allBanners);
//     if (req.session.userLoggedIn) {



//         console.log(req.session);
//         console.log(req.session.loggedUserName);
//         const userName = req.session.loggedUserName
//         const userId = req.session.loggedUserId
//         console.log(userName);

//         const numberOfProductsInCart = await Cart.find({ userId: userId })
//         // console.log(numberOfProductsInCart[0].products.length);
//         if ((await numberOfProductsInCart).length > 0) {
//             cartLength = numberOfProductsInCart[0].products.length
//         } else {
//             cartLength = 0
//         }


//         return res.render('userFiles/mainPage', { user: true, usersName: userName, userId, allBanners, cartLength })

//     } else {
//         return res.render('userFiles/mainPage', { user: false, allBanners })

//     }
// })

// router.get('/shop', (req, res) => {

//     if (req.session.userLoggedIn) {

//         console.log(req.session);
//         Product.find({}, (err, foundResult) => {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log(foundResult);

//                 const userName = req.session.loggedUserName
//                 const userId = req.session.loggedUserId
//                 console.log(userName);


//                 return res.render('userFiles/shopPage', { user: true, products: foundResult, usersName: userName, userId })
//             }
//         })
//     } else {
//         Product.find({}, (err, foundResult) => {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log(foundResult);

//                 return res.render('userFiles/shopPage', { user: false, products: foundResult })
//             }
//         })

//     }


// })



// router.get('/register', (req, res) => {
//     if (req.session.userLoggedIn) {
//         res.redirect('/')
//     } else {
//         res.render('userFiles/registerPage', { validation: req.flash('validationRegister'), numberExist: req.flash('numberExist') })

//     }

// })





// router.get('/login', (req, res) => {
//     if (req.session.userLoggedIn) {
//         res.redirect('/')
//     } else {
//         res.render('userFiles/loginPage', { validation: req.flash('validationLogin') })
//     }

// })



// router.get('/otpVerify', (req, res) => {
//     if (req.session.userLoggedIn) {
//         res.redirect('/')
//     } else {
//         res.render('userFiles/verifyRegisterOtp', {})

//     }

// })

// router.get('/shopSingle/:id', async (req, res, next) => {

//     const productId = req.params.id
//     const userName = req.session.loggedUserName
//     const userId = req.session.loggedUserId
//     console.log(userName);
//     console.log(productId);

//     const thisProduct = await Product.findById(productId)
//     console.log(thisProduct);
//     if (req.session.userLoggedIn) {

//         const numberOfProductsInCart = await Cart.find({ userId: userId })
//         // console.log(numberOfProductsInCart[0].products.length);
//         if ((await numberOfProductsInCart).length > 0) {
//             cartLength = numberOfProductsInCart[0].products.length
//         } else {
//             cartLength = 0
//         }


//         res.render('userFiles/shopSingle', { user: true, usersName: userName, thisProduct, cartLength })
//     } else {
//         res.render('userFiles/shopSingle', { user: false, usersName: userName, thisProduct })
//     }

// })

// router.get('/cart', async (req, res) => {

//     if (req.session.userLoggedIn) {
//         const userName = req.session.loggedUserName
//         const userId = req.session.loggedUserId

//         const cartOfUser = await Cart.findOne({ userId })
//         console.log();
//         if (cartOfUser.products.length != 0) {
//             // console.log(cartOfUser); 
//             const isThereProductInCart = cartOfUser.products.length
//             // console.log(cartOfUser.products);
//             // console.log(isThereProductInCart);
//             res.render('userFiles/userCart', { user: true, usersName: userName, cartOfUser, userId })
//         } else {
//             res.render('userFiles/emptyCart', { user: true, usersName: userName, userId })
//         }
//     } else {
//         res.redirect('/login')

//     }

// })



// router.get('/profile', async (req, res) => {
//     if (req.session.userLoggedIn) {
//         const userName = req.session.loggedUserName
//         const userId = req.session.loggedUserId

//         const userDetailes = await User.findById(userId)
//         // console.log(userDetails);


//         res.render('userFiles/userProfile', { user: true, usersName: userName, userId, userDetailes })
//     } else {
//         res.redirect('/login')
//     }
// })

// router.get('/removeItemFromCart/:id', async (req, res) => {

//     const productId = req.params.id
//     const userId = req.session.loggedUserId


//     let cart = await Cart.findOne({ userId });
//     console.log(cart);
//     if (cart) {
//         //cart exists for user
//         let itemIndex = cart.products.findIndex(p => p.productId == productId);

//         if (itemIndex > -1) {
//             //product exists in the cart, update the quantity
//             cart.products.splice(itemIndex, 1)
//             // productItem.productQuantity = productItem.productQuantity + parseInt(productQuantity);
//             // cart.products[itemIndex] = productItem;

//             cart = await cart.save().then(console.log("Product Removed"));
//             // res.redirect('/cart')    
//         }
//     }
//     res.redirect('/cart')


//     // res.render('userFiles/onlinePayment',{user: true, usersName: userName, userId})
// })

// router.get('/orders', async (req, res) => {
//     if (req.session.userLoggedIn) {
//         const userId = req.session.loggedUserId
//         const userName = req.session.loggedUserName

//         const userOrders = await Order.find({ userId: userId })
//         // console.log(userOrders[0].orders[0].products[0]);
//         console.log(userOrders);
//         console.log(userOrders[0]);
//         console.log(userOrders[0].orders);
//         console.log(userOrders[0].orders[0]);
//         console.log(userOrders[0].orders[0].products);


//         res.render('userFiles/orderHistory', { user: true, usersName: userName, userId, userOrders })
//     } else {
//         res.redirect('/login')
//     }

// })
// router.get('/orderPlacedStatus', (req, res) => {
//     res.render('userFiles/orderPlaced', { user: false })
// })

// router.get('/wishlist', (req, res) => {
//     res.render('userFiles/userWishlist', { user: false })
// })




























module.exports = router