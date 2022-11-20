require('dotenv').config()
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Banner = require('../models/bannerModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { handleAsync } = require('../middleware/handlingAsync/handleAsync');


exports.getMainPage = async (req,res)=>{

    const allBanners = await Banner.find({})
    console.log(allBanners);
    if (req.session.userLoggedIn) {
        // console.log(req.session);
        // console.log(req.session.loggedUserName);
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId
        // console.log(userName);

        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }
        return res.render('userFiles/mainPage', { user: true, usersName: userName, userId, allBanners, cartLength })

    } else {
        return res.render('userFiles/mainPage', { user: false, allBanners })

    }
}


exports.getShop = (req,res)=>{
    if (req.session.userLoggedIn) {
        // console.log(req.session);
        Product.find({}, (err, foundResult) => {
            if (err) {
                console.log(err);
            }
            else {
                // console.log(foundResult);
                const userName = req.session.loggedUserName
                const userId = req.session.loggedUserId
                // console.log(userName);
                return res.render('userFiles/shopPage', { user: true, products: foundResult, usersName: userName, userId })
            }
        })
    } else {
        Product.find({}, (err, foundResult) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(foundResult);
                return res.render('userFiles/shopPage', { user: false, products: foundResult })
            }
        })
    }
}

exports.getRegister = (req,res)=>{
    if (req.session.userLoggedIn) {
        res.redirect('/')
    } else {
        res.render('userFiles/registerPage', { validation: req.flash('validationRegister'), numberExist: req.flash('numberExist') })

    }
}

exports.getLogin = (req,res)=>{
    if (req.session.userLoggedIn) {
        res.redirect('/')
    } else {
        res.render('userFiles/loginPage', { validation: req.flash('validationLogin') })
    }
}

exports.getOtpVerify = (req,res)=>{
    if (req.session.userLoggedIn) {
        res.redirect('/')
    } else {
        res.render('userFiles/verifyRegisterOtp', {})

    }
}

exports.getShopingSingle = async (req,res)=>{
    const productId = req.params.id
    const userName = req.session.loggedUserName
    const userId = req.session.loggedUserId
    console.log(userName);
    console.log(productId);

    const thisProduct = await Product.findById(productId)
    console.log(thisProduct);
    if (req.session.userLoggedIn) {

        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }


        res.render('userFiles/shopSingle', { user: true, usersName: userName, thisProduct, cartLength })
    } else {
        res.render('userFiles/shopSingle', { user: false, usersName: userName, thisProduct })
    }
}

exports.getCart = async (req,res)=>{
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const cartOfUser = await Cart.findOne({ userId })
        console.log();
        if (cartOfUser.products.length != 0) {
            // console.log(cartOfUser); 
            const isThereProductInCart = cartOfUser.products.length
            // console.log(cartOfUser.products);
            // console.log(isThereProductInCart);
            res.render('userFiles/userCart', { user: true, usersName: userName, cartOfUser, userId })
        } else {
            res.render('userFiles/emptyCart', { user: true, usersName: userName, userId })
        }
    } else {
        res.redirect('/login')

    }
}

exports.getSelectAddressAndPayment =async (req,res)=>{
    const { cartTotal } = req.body
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const toFindUserAddress = await User.findOne({ _id: userId })
        const savedAddress = toFindUserAddress.address
        console.log(savedAddress);


        res.render('userFiles/paymentAndAddress', { user: true, usersName: userName, userId, savedAddress, cartTotal })
    } else {
        res.redirect('/login')
    }
}

exports.getProfile = async (req,res)=>{
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const userDetailes = await User.findById(userId)
        // console.log(userDetails);


        res.render('userFiles/userProfile', { user: true, usersName: userName, userId, userDetailes })
    } else {
        res.redirect('/login')
    }
}

exports.getRemoveItemFromCart = async (req,res)=>{
    const productId = req.params.id
    const userId = req.session.loggedUserId


    let cart = await Cart.findOne({ userId });
    console.log(cart);
    if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);

        if (itemIndex > -1) {
            //product exists in the cart, update the quantity
            cart.products.splice(itemIndex, 1)
            // productItem.productQuantity = productItem.productQuantity + parseInt(productQuantity);
            // cart.products[itemIndex] = productItem;

            cart = await cart.save().then(console.log("Product Removed"));
            // res.redirect('/cart')    
        }
    }
    res.redirect('/cart')

}

exports.getOrders = async (req,res)=>{
    if (req.session.userLoggedIn) {
        const userId = req.session.loggedUserId
        const userName = req.session.loggedUserName

        const userOrders = await Order.find({ userId: userId })
        // console.log(userOrders[0].orders[0].products[0]);
        console.log(userOrders);
        console.log(userOrders[0]);
        console.log(userOrders[0].orders);
        console.log(userOrders[0].orders[0]);
        console.log(userOrders[0].orders[0].products);


        res.render('userFiles/orderHistory', { user: true, usersName: userName, userId, userOrders })
    } else {
        res.redirect('/login')
    }
}

exports.getOrderPlacedStatus = (req,res)=>{
    res.render('userFiles/orderPlaced', { user: false })
}

exports.getWishlist = (req,res)=>{
    res.render('userFiles/userWishlist', { user: false })
}