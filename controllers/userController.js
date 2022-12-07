require('dotenv').config()
const Admin = require('../models/adminModel');
const Razorpay = require('razorpay')
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
var mongoose = require('mongoose');
const Coupon = require('../models/couponModel');
const instance = new Razorpay({ key_id: 'rzp_test_nskbaOm2bho9QL', key_secret: 'hC8hOtH65DFfZ52JZgcuuTrc' })





// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



















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

exports.getRemoveItemFromWishlist = async (req, res) => {
    const productId = req.params.id
    const userId = req.session.loggedUserId


    let wishlist = await Wishlist.findOne({ userId });
    console.log(wishlist);
    if (wishlist) {
        //wishlist exists for user
        let itemIndex = wishlist.products.findIndex(p => p.product == productId);

        if (itemIndex > -1) {
            //product exists in the cart, update the quantity
            wishlist.products.splice(itemIndex, 1)
            // productItem.productQuantity = productItem.productQuantity + parseInt(productQuantity);
            // cart.products[itemIndex] = productItem;

            wishlist = await wishlist.save().then(console.log("Product Removed from wishlist"));
            // res.redirect('/wishlist')    
        }
    }
    res.redirect('/wishlist')
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


exports.postUpdateOrderStatus = async (req, res) => {
    const userId = req.params.userId
    const orderId = req.params.orderId

    console.log(userId);
    console.log(orderId);



    const userOfOrder = await Order.find({ userId: userId })
    const findingIndexOfOrder = userOfOrder[0].orders.findIndex(indexToChange => indexToChange._id == orderId)
    userOfOrder[0].orders[findingIndexOfOrder].status = req.body.orderStatus

    userOfOrder[0].save().then(console.log("Status changed"))

    console.log(findingIndexOfOrder);

    console.log(req.body);
    res.redirect('/admin/showOrder')
}

exports.getFilterByCategory = async (req, res) => {

    const categoryId = req.params.categoryId
    const productsInSpecificCategory = await Product.find({ productCategory: categoryId })
    const userName = req.session.loggedUserName
    const userId = req.session.loggedUserId
    const numberOfProductsInCart = await Cart.find({ userId: userId })

    if ((numberOfProductsInCart).length > 0) {
        cartLength = numberOfProductsInCart[0].products.length
    } else {
        cartLength = 0
    }

    const allCategories = await Category.find({})
    console.log(allCategories);

    console.log(categoryId);
    console.log(productsInSpecificCategory);

    return res.render('userFiles/shopPage', { user: true, products: productsInSpecificCategory, usersName: userName, userId, cartLength, allCategories })
}

exports.postRegister = async (req, res) => {
    const { name, password, number } = req.body

    const sameMobile = await User.find({ mobileNumber: number })
    console.log(sameMobile);

    if (sameMobile.length > 0) {
        req.flash('numberExist', 'Mobile number already taken')
        console.log("Mobile Number Already Exist");
        res.redirect('/register');
    } else {
        client.verify.v2.services(process.env.SERVICE_SID)
            .verifications
            .create({ to: `+91${number}`, channel: 'sms' })
            .then((verification) => {
                console.log(verification.status)

                console.log("Send otp");
                if (verification.status === "pending") {
                    const userRegisterData = {
                        name,
                        password,
                        number
                    }
                    req.session.userRegisterDetailes = userRegisterData

                    res.redirect('/otpVerify')
                } else {
                    console.log("Something Wrong Try again");
                    res.redirect('/register')
                }
            }).catch((err) => {
                console.log(err);
            });

    }
}


exports.postVerifyOtp = (req, res) => {
    const otp = req.body.otp
    console.log(req.session);
    const userData = {
        name: req.session.userRegisterDetailes.name,
        number: req.session.userRegisterDetailes.number,
        password: req.session.userRegisterDetailes.password,
    }


    console.log(otp);
    console.log(userData);

    client.verify.v2.services(process.env.SERVICE_SID)
        .verificationChecks
        .create({ to: `+91${userData.number}`, code: otp })
        .then((verification_check) => {
            console.log(verification_check.status)
            if (verification_check.status === "approved") {
                const addUser = new User({
                    name: userData.name,
                    mobileNumber: userData.number,
                    password: userData.password,
                    access: true,

                })
                addUser.save().then(console.log("User created")).catch((err) => {
                    console.log(err);
                })

                res.redirect('/login')
            } else {
                console.log("Something wrong with approval");
            }
        }).catch((err) => {
            console.log(err);
        });
}

exports.postLogin = async (req, res, next) => {
    const { loginNumber, loginPassword } = req.body

    try {
        const registeredUser = await User.find({ mobileNumber: loginNumber })
        console.log(registeredUser);
        if (registeredUser.length > 0) {
            console.log("user Exist");
            if (registeredUser[0].password === loginPassword) {
                req.session.userLoggedIn = true
                req.session.loggedUserName = registeredUser[0].name
                req.session.loggedUserId = registeredUser[0]._id
                res.redirect('/')
            }
        } else {
            console.log("No user with this Mobile number");
            res.redirect('/login')
        }
    } catch (err) {
        console.log(err);

    }
}

exports.postAddToCArt = async (req, res) => {
    if (req.session.userLoggedIn) {

        const productId = req.params.id
        const productToAdd = await Product.findById(productId)
        // console.log(productToAdd);
        const productQuantity = 1
        const productName = productToAdd.productName
        const productPrice = productToAdd.productPrice
        const productImages = productToAdd.productImages
        // console.log(productImages);
        const userId = req.session.loggedUserId
        // console.log(productToAdd.productPrice);
        // console.log(productToAdd.productName);
        try {
            let cart = await Cart.findOne({ userId });
            console.log(cart);
            if (cart) {
                //cart exists for user
                let itemIndex = cart.products.findIndex(p => p.productId == productId);

                if (itemIndex > -1) {
                    console.log("incrementing quantity");
                    //product exists in the cart, update the quantity
                    let productItem = cart.products[itemIndex];
                    productItem.productQuantity = productItem.productQuantity + parseInt(productQuantity);
                    cart.products[itemIndex] = productItem;

                    cart = await cart.save().then(console.log("Product Incremented"));


                    const numberOfProductsInCart = await Cart.find({ userId: userId })
                    if ((numberOfProductsInCart).length > 0) {
                        cartLength = numberOfProductsInCart[0].products.length
                    } else {
                        cartLength = 0
                    }


                    res.json({ status: true, cartLength })
                    // res.redirect('/cart')    
                } else {
                    //product does not exists in cart, add new item in existing cart
                    console.log("Adding product to existing user");
                    cart.products.push({ productId, productQuantity, productName, productPrice, productImages });
                    cart = await cart.save().then(console.log("Product added "));

                    const numberOfProductsInCart = await Cart.find({ userId: userId })
                    if ((numberOfProductsInCart).length > 0) {
                        cartLength = numberOfProductsInCart[0].products.length
                    } else {
                        cartLength = 0
                    }

                    res.json({ status: true, cartLength })
                    // res.redirect('/cart')
                }

            } else {
                //no cart for user, create new cart
                console.log("no cart");

                const newCart = new Cart({
                    userId,
                    products: [{ productId, productQuantity, productName, productPrice, productImages }]
                })

                newCart.save().then(console.log("Added new cart")).catch((err) => { console.log(err); })

                const numberOfProductsInCart = await Cart.find({ userId: userId })
                if ((numberOfProductsInCart).length > 0) {
                    cartLength = numberOfProductsInCart[0].products.length
                } else {
                    cartLength = 0
                }

                res.json({ status: true, cartLength })

                // res.send()  redirect('/cart')
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    } else {

        res.json({ status: false })
        console.log("No user");
        // res.redirect('/login')
    }
}

exports.postChangeProductQuantity = async (req, res) => {

    console.log(req.body);
    const { userId, count, productId } = req.body

    console.log(userId);
    console.log(count);
    console.log(productId);

    let cart = await Cart.findOne({ userId });
    // console.log(cart.products );
    if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);
        console.log(itemIndex);
        if (itemIndex > -1) {
            console.log("incrementing quantity");
            //product exists in the cart, update the quantity
            let productItem = cart.products[itemIndex];
            productItem.productQuantity = productItem.productQuantity + parseInt(count);
            cart.products[itemIndex] = productItem;

            cart = await cart.save().then(console.log("Product Incremented"));
            console.log(cart.products);
            // p.productId == productId
            let getQuantityitemIndex = cart.products.findIndex(p => p.productId == productId);
            console.log(getQuantityitemIndex);
            if (itemIndex > -1) {
                let getQuantityProductItem = cart.products[itemIndex];
                let requiredQuantity = getQuantityProductItem.productQuantity
                let requiredPrice = getQuantityProductItem.productPrice
                res.json({ productQuantity: requiredQuantity, productPrice: requiredPrice })
            }
        }
    }


}


exports.postAddAddress = async (req, res) => {
    console.log(req.body);
    const { name, address, zipCode, mobileNumber, alternateMobileNumber } = req.body
    const userId = req.session.loggedUserId
    console.log(userId);

    const userToUpdate = await User.find({ _id: userId })
    console.log(userToUpdate);

    if (userToUpdate != null) {
        userToUpdate[0].address.push({ name, address, zipCode, mobileNumber, alternateMobileNumber })
        userToUpdate[0].save().then((address) => {
            console.log(address);
            console.log("Address saved");
        })
    }
    res.redirect('/selectAddressAndPayment')
}


exports.getSelectAddressAndPayment = async (req, res) => {
    const { total } = req.params

    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const toFindUserAddress = await User.findOne({ _id: userId })
        const savedAddress = toFindUserAddress.address
        console.log(savedAddress);


        res.render('userFiles/paymentAndAddress', { user: true, usersName: userName, userId, savedAddress, cartTotal: total })
    } else {
        res.redirect('/login')
    }
}



exports.postOrderPlaced = async (req, res) => {
    console.log(req.body);

    console.log("At cod");

    console.log("From orderPlaced COD");
    const userId = req.session.loggedUserId
    console.log(req.body);

    const cartOfUser = await Cart.find({ userId: userId })
    const products = cartOfUser[0].products

    const previousOrdersOfUser = await Order.find({ userId: userId })
    console.log(previousOrdersOfUser);

    if (previousOrdersOfUser.length > 0) {
        console.log("Before");
        console.log(previousOrdersOfUser[0].orders);

        let orderId = ''

        let productsToPush = []

        for (product of products) {
            productsToPush.push(product)
        }
        console.log(productsToPush[0]);
        previousOrdersOfUser[0].orders.push({
            products: productsToPush
        })

        console.log("After");
        console.log(previousOrdersOfUser[0].orders);

        previousOrdersOfUser[0].save().then((savedOrder) => {
            console.log("Added new order to prev user")
            const lastOfOrders = savedOrder.orders.length
            console.log(lastOfOrders);
            orderId = savedOrder.orders[lastOfOrders - 1]._id
            console.log(savedOrder.orders[lastOfOrders - 1]._id);
            console.log("Added new order to prev user")
        })

        const cartOfUserToClean = await Cart.find({ userId: userId })
        const productsLength = cartOfUserToClean[0].products.length
        let productsToClean = cartOfUserToClean[0].products.splice(0, productsLength)


        console.log(cartOfUserToClean);

        await cartOfUserToClean[0].save().then(console.log("Cart cleaned"))


        if (req.body.payment === "cod") {
            res.json({ paymentType: "cod" })
        } else if (req.body.payment === "online") {

            let orderIdInString = orderId.toString()
            console.log(orderIdInString);

            let totalAmount = parseInt(req.body.cartTotal)
            console.log(totalAmount);
            console.log(typeof (totalAmount));

            function generateRazorpay() {
                instance.orders.create({
                    amount: totalAmount * 100,
                    currency: "INR",
                    receipt: orderIdInString,
                    // notes: {
                    //   key1: "value3",
                    //   key2: "value2" 
                    // }
                }, (err, order) => {
                    console.log(order);
                    res.json({ paymentType: "onlinePayment", order })
                })
            }
            generateRazorpay()


        }

    }
    else {

        const orderedProducts = []

        for (product of products) {
            orderedProducts.push(product)
        }


        const newOrder = new Order({
            userId: userId,
            orders: [{
                products: orderedProducts
            }]
        })

        await newOrder.save().then((savedOrder) => {
            console.log("Order Saved")
            console.log(savedOrder);
            console.log("Order Saved")
        })

        const cartOfUserToClean = await Cart.find({ userId: userId })
        const productsLength = cartOfUserToClean[0].products.length
        let productsToClean = cartOfUserToClean[0].products.splice(0, productsLength)


        console.log(cartOfUserToClean);

        await cartOfUserToClean[0].save().then(console.log("Cart cleaned"))

        if (req.body.payment === "cod") {
            res.json({ paymentType: "cod" })
        } else if (req.body.payment === "online") {

            let orderIdInString = orderId.toString()
            console.log(orderIdInString);

            let totalAmount = parseInt(req.body.cartTotal)
            console.log(totalAmount);
            console.log(typeof (totalAmount));

            function generateRazorpay() {
                instance.orders.create({
                    amount: totalAmount,
                    currency: "INR",
                    receipt: orderIdInString,
                    // notes: {
                    //   key1: "value3",
                    //   key2: "value2" 
                    // }
                }, (err, order) => {
                    console.log(order);
                    res.json({ paymentType: "onlinePayment", order })
                })
            }
            generateRazorpay()


        }
    }
}


exports.postWishList = async (req, res) => {

    if (req.session.userLoggedIn) {
        const productId = req.params.id
        console.log(productId);
        const productIdInObjectId = mongoose.Types.ObjectId(productId)
        console.log(productIdInObjectId);
        const userId = req.session.loggedUserId


        const inWishlist = await Wishlist.findOne({ userId })
        console.log("printing inwishlist");
        console.log(inWishlist);
        console.log("printing inwishlist");

        if (inWishlist != null) {

            let findIndex = inWishlist.products.findIndex(p => p.product == productId)
            console.log(findIndex);
            if (findIndex >= 0) {
                inWishlist.products.splice(findIndex, 1)
                await inWishlist.save().then(console.log("Item Removed"));
                res.json({ status: true })
                // res.redirect('/shop')
            } else if (findIndex == -1) {
                // console.log(productId);

                inWishlist.products.push({
                    product: productId
                })

                inWishlist.save().then((saved) => {
                    console.log("Saved to existing user wishlist");
                })
                res.json({ status: true })
                // res.redirect('/shop')
            }
        } else {
            const newWishlist = new Wishlist({
                userId: userId,
                products: [{
                    product: productId
                }]
            })
            newWishlist.save().then((saved) => {
                console.log("New wishlist for user");
            })
            res.json({ status: true })
            // res.redirect('/shop')

        }

    } else {
        res.json({ status: false })

    }


}

exports.postVerifyPayment = async (req, res) => {
    const orderId = req.body.payment.razorpay_order_id
    const paymentId = req.body.payment.razorpay_payment_id
    const signature = req.body.payment.razorpay_signature

    const crypto = require('crypto')
    let hmac = crypto.createHmac('sha256', 'hC8hOtH65DFfZ52JZgcuuTrc')

    hmac.update(orderId + '|' + paymentId)
    hmac = hmac.digest('hex')

    if (hmac == signature) {
        console.log("good");
        res.json({ status: true })
    } else {
        res.json({ status: false })
        console.log("BAd");
    }
}

exports.getEditProfile = async (req, res) => {
    if (req.session.userLoggedIn) {
        const userName = req.session.loggedUserName
        const userId = req.session.loggedUserId

        const user = await User.findById(userId)

        console.log(user);

        res.render('userFiles/editProfile', { user: true, usersName: userName, userId, userData: user })
    } else {
        res.redirect('/login')
    }
}

exports.postEditProfile = async (req, res) => {
    const { name, number, email } = req.body
    const userId = req.session.loggedUserId
    // const updated = await User.findByIdAndUpdate(userId, { name:name,mobileNumber:number,email })
    const updated = await User.findById(userId)
    updated.name = name
    updated.mobileNumber = number
    updated.email = email
    req.session.loggedUserName = name
    console.log(req.session.loggedUserName);

    updated.save().then(console.log("Done"))
    console.log("dasdas");
    console.log(updated);
    console.log("dasdas");
    res.redirect('/profile')
}

exports.getAddToCartFromWishlist = async (req, res) => {
    if (req.session.userLoggedIn) {
        const productId = req.params.id
        const userId = req.session.loggedUserId
        const productToAdd = await Product.findById(productId)

        const productQuantity = 1
        const productName = productToAdd.productName
        const productPrice = productToAdd.productPrice
        const productImages = productToAdd.productImages


        try {
            let cart = await Cart.findOne({ userId });
            console.log(cart);
            if (cart) {
                //cart exists for user
                let itemIndex = cart.products.findIndex(p => p.productId == productId);

                if (itemIndex > -1) {
                    console.log("incrementing quantity");
                    //product exists in the cart, update the quantity
                    let productItem = cart.products[itemIndex];
                    productItem.productQuantity = productItem.productQuantity + parseInt(productQuantity);
                    cart.products[itemIndex] = productItem;

                    cart = await cart.save().then(console.log("Product Incremented"));


                    const productOfWishlistToClean = await Wishlist.find({ userId: userId })
                    console.log(productId);
                    let itemIndexOfWishlist = productOfWishlistToClean[0].products.findIndex(p2 => p2.product.toString() === productId);
                    if (itemIndexOfWishlist > -1) {
                        let productToClean = productOfWishlistToClean[0].products.splice(itemIndexOfWishlist, 1)
                    }
                    // const productsLength = productOfWishlistToClean[0].products.length
                    console.log(productOfWishlistToClean);
                    console.log(productOfWishlistToClean[0]);
                    console.log(itemIndexOfWishlist);

                    await productOfWishlistToClean[0].save().then(console.log("Removed the product fronm Wishlist "))


                    // res.json({ status: true })
                    res.redirect('/cart')
                } else {
                    //product does not exists in cart, add new item in existing cart
                    console.log("Adding product to existing user");
                    cart.products.push({ productId, productQuantity, productName, productPrice, productImages });
                    cart = await cart.save().then(console.log("Product added "));


                    const productOfWishlistToClean = await Wishlist.find({ userId: userId })
                    console.log(productId);
                    let itemIndexOfWishlist = productOfWishlistToClean[0].products.findIndex(p2 => p2.product.toString() === productId);
                    if (itemIndexOfWishlist > -1) {
                        let productToClean = productOfWishlistToClean[0].products.splice(itemIndexOfWishlist, 1)
                    }
                    // const productsLength = productOfWishlistToClean[0].products.length
                    console.log(productOfWishlistToClean);
                    console.log(productOfWishlistToClean[0]);
                    console.log(itemIndexOfWishlist);

                    await productOfWishlistToClean[0].save().then(console.log("Removed the product fronm Wishlist "))

                    // res.json({ status: true })
                    res.redirect('/cart')
                }

            } else {
                //no cart for user, create new cart
                console.log("no cart");

                const newCart = new Cart({
                    userId,
                    products: [{ productId, productQuantity, productName, productPrice, productImages }]
                })

                newCart.save().then(console.log("Added new cart")).catch((err) => { console.log(err); })


                // res.json({ status: true })

                res.redirect('/cart')
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }

    } else {
        console.log("No user");
        res.redirect('/shop')

    }
}

exports.getRemoveAddress = async (req, res) => {
    if (req.session.userLoggedIn) {
        const productId = req.params.id
        const userId = req.session.loggedUserId

        const user = await User.findById(userId)

        let addressIndexToRemove = user.address.findIndex(add => add._id.toString() === productId);
        console.log(user);
        console.log(addressIndexToRemove);
        if (addressIndexToRemove > -1) {
            let addressToClean = user.address.splice(addressIndexToRemove, 1)
        }
        await user.save().then(console.log("Address removed"))
        res.redirect('/selectAddressAndPayment')
    } else {
        res.redirect('/login')
    }

}

exports.postApplyCoupon = async (req, res) => {
    const { userId, couponCode } = req.body
    console.log(userId);
    console.log(couponCode);

    const checkingCouponValidity = await Coupon.find({ code: couponCode })

    console.log(checkingCouponValidity);

    if (checkingCouponValidity.length > 0) {

        const totalQuantity = parseInt(checkingCouponValidity[0].quantity)

        console.log(typeof (totalQuantity));
        console.log(totalQuantity);

        for (userUsed of checkingCouponValidity[0].usedBy) {
            if (userUsed === userId) {
                console.log("Coupon already used by this user");
                return res.json({ status: "couponAlreadyUsedByThisUser" })
            }
        }

        if (totalQuantity == 0) {
            console.log("Coupon limit exceeded");
            return res.json({ status: "couponLimitExceeded" })
        }

        checkingCouponValidity[0].usedBy.push(userId)
        checkingCouponValidity[0].quantity = checkingCouponValidity[0].quantity - 1
        checkingCouponValidity[0].save().then(console.log("Saved"))

        res.json({ status: "couponApplied", percentage: checkingCouponValidity[0].percentage })

    }

}