require('dotenv').config()
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Banner = require('../models/bannerModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { handleAsync } = require('../middleware/handlingAsync/handleAsync');
const Wishlist = require('../models/wishlistModel');
const { findById } = require('../models/cartModel');

var ObjectId = require('mongodb').ObjectID;



exports.getMainPage = async (req, res) => {

    const allBanners = await Banner.find({})
    const categories = await Category.find({})
    const products = await Product.find({})
    console.log(products);


    if (req.session.userLoggedIn) {
        // console.log(req.session);
        // console.log(req.session.loggedUserName);
        const userName = req.session.loggedUserName
        console.log(userName);
        const userId = req.session.loggedUserId
        // console.log(userName);
        const user = await User.findById(userId)
        console.log(user);

        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }



        return res.render('userFiles/mainPage', { user: true, usersName: user.name, userId, allBanners, cartLength, categories, products })

    } else {
        return res.render('userFiles/mainPage', { user: false, allBanners, categories, products })

    }
}


exports.getShop = (req, res) => {
    if (req.session.userLoggedIn) {
        // console.log(req.session);
        Product.find({}, async (err, foundResult) => {
            if (err) {
                console.log(err);
            }
            else {
                const userName = req.session.loggedUserName
                const userId = req.session.loggedUserId
                // console.log(foundResult);
                const numberOfProductsInCart = await Cart.find({ userId: userId })
                // console.log(numberOfProductsInCart[0].products.length);
                if ((numberOfProductsInCart).length > 0) {
                    cartLength = numberOfProductsInCart[0].products.length
                } else {
                    cartLength = 0
                }

                const allCategories = await Category.find({})
                console.log(allCategories);

                // console.log(userName);
                return res.render('userFiles/shopPage', { user: true, products: foundResult, usersName: userName, userId, cartLength, allCategories })
            }
        })
    } else {
        Product.find({}, async (err, foundResult) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(foundResult);
                const allCategories = await Category.find({})
                console.log(allCategories);
                return res.render('userFiles/shopPage', { user: false, products: foundResult, allCategories })
            }
        })
    }
}

exports.getRegister = (req, res) => {
    if (req.session.userLoggedIn) {
        res.redirect('/')
    } else {
        res.render('userFiles/registerPage', { validation: req.flash('validationRegister'), numberExist: req.flash('numberExist') })

    }
}

exports.getLogin = (req, res) => {
    if (req.session.userLoggedIn) {
        res.redirect('/')
    } else {
        res.render('userFiles/loginPage', { validation: req.flash('validationLogin') })
    }
}

exports.getOtpVerify = (req, res) => {
    if (req.session.userLoggedIn) {
        res.redirect('/')
    } else {
        res.render('userFiles/verifyRegisterOtp', {})

    }
}

exports.getShopingSingle = async (req, res) => {
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


exports.getAbout = async (req, res) => {
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId


        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }

        res.render('userFiles/aboutUs', { user: true, usersName: userName, userId })
    } else {
        res.render('userFiles/aboutUs', { user: false })
    }
}

exports.getCart = async (req, res) => {
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

            const numberOfProductsInCart = await Cart.find({ userId: userId })
            // console.log(numberOfProductsInCart[0].products.length);
            if ((await numberOfProductsInCart).length > 0) {
                cartLength = numberOfProductsInCart[0].products.length
            } else {
                cartLength = 0
            }

            res.render('userFiles/userCart', { user: true, usersName: userName, cartOfUser, userId, cartLength })
        } else {
            res.render('userFiles/emptyCart', { user: true, usersName: userName, userId, cartLength })
        }
    } else {
        res.redirect('/login')

    }
}

exports.getSelectAddressAndPayment = async (req, res) => {
    const { cartTotal } = req.body
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const toFindUserAddress = await User.findOne({ _id: userId })
        const savedAddress = toFindUserAddress.address
        console.log(savedAddress);

        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }

        res.render('userFiles/paymentAndAddress', { user: true, usersName: userName, userId, savedAddress, cartTotal, cartLength })
    } else {
        res.redirect('/login')
    }
}

exports.getProfile = async (req, res) => {
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const userDetailes = await User.findById(userId)
        // console.log(userDetails);

        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }

        res.render('userFiles/userProfile', { user: true, usersName: userName, userId, userDetailes, cartLength })
    } else {
        res.redirect('/login')
    }
}

exports.getRemoveItemFromCart = async (req, res) => {
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

exports.getOrders = async (req, res) => {
    if (req.session.userLoggedIn) {
        const userId = req.session.loggedUserId
        const userName = req.session.loggedUserName

        const userOrders = await Order.aggregate([
            {
                '$unwind': {
                    'path': '$orders'
                }
            }, {
                '$sort': {
                    'orders.orderedDate': -1
                }
            },
            // {
            //     $unwind:{
            //         path:'$orders.products'
            //     }
            // }

        ])

        // const userOrders = await Order.find({ userId: userId })
        // console.log(userOrders[0].orders[0].products[0]);
        console.log(userOrders);
        // console.log(userOrders[0]);
        // console.log(userOrders[0].orders);
        // console.log(userOrders[0].orders[0]);
        // console.log(userOrders[0].orders[0].products);

        const numberOfProductsInCart = await Cart.find({ userId: userId })
        // console.log(numberOfProductsInCart[0].products.length);
        if ((await numberOfProductsInCart).length > 0) {
            cartLength = numberOfProductsInCart[0].products.length
        } else {
            cartLength = 0
        }


        res.render('userFiles/orderHistory', { user: true, usersName: userName, userId, userOrders, cartLength })
    } else {
        res.redirect('/login')
    }
}

exports.getOrderPlacedStatus = async (req, res) => {
    const userId = req.session.loggedUserId
    const userName = req.session.loggedUserName
    const numberOfProductsInCart = await Cart.find({ userId: userId })


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

    // console.log(numberOfProductsInCart[0].products.length);
    if ((numberOfProductsInCart).length > 0) {
        cartLength = numberOfProductsInCart[0].products.length
    } else {
        cartLength = 0
    }
    res.render('userFiles/orderPlaced', { user: true, usersName: userName, userId, cartLength, detailesOfLastOrderOfUser })
}

exports.getWishlist = async (req, res) => {
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId
        const wishlistOfUser = await Wishlist.find({ userId })
        console.log(wishlistOfUser.length);
        console.log(wishlistOfUser[0]);
        console.log(wishlistOfUser[0].products);

        if (wishlistOfUser[0].products.length > 0) {
            let productsInWishlist = []
            for (let eachProduct of wishlistOfUser[0].products) {
                productId = eachProduct.product
                console.log(productId);

                let product = await Product.findById(productId)

                productsInWishlist.push(product)


            }
            console.log(productsInWishlist);


            const numberOfProductsInCart = await Cart.find({ userId: userId })
            // console.log(numberOfProductsInCart[0].products.length);
            if ((await numberOfProductsInCart).length > 0) {
                cartLength = numberOfProductsInCart[0].products.length
            } else {
                cartLength = 0
            }

            res.render('userFiles/userWishlist', { user: true, usersName: userName, userId, productsInWishlist, cartLength })
        } else {
            res.render('userFiles/emptyWishlist', { user: true, usersName: userName, userId })
        }



    } else {
        res.redirect('/login')
    }
}