require('dotenv').config()
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay')
const instance = new Razorpay({ key_id: 'rzp_test_nskbaOm2bho9QL', key_secret: 'hC8hOtH65DFfZ52JZgcuuTrc' })


const User = require('../models/userModel');
const { validatingUserRegisterPartOne, validatingUserRegisterPartTwo } = require('../middleware/validation/userRegister');
const { validatingUserLoginPartOne, validatingUserLoginPartTwo } = require('../middleware/validation/userLogin');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const { getMainPage, getShop, getRegister, getLogin, getOtpVerify, getShopingSingle, getCart, getSelectAddressAndPayment, getProfile, getRemoveItemFromCart, getOrders, getOrderPlacedStatus, getWishlist } = require('../controllers/userController');
const Banner = require('../models/bannerModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel');
const { default: mongoose } = require('mongoose');


// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



router.route('/').get(getMainPage)
router.route('/register').get(getRegister)
router.route('/otpVerify').get(getOtpVerify)
router.route('/login').get(getLogin)
router.route('/shop').get(getShop)
router.route('/shopSingle/:id').get(getShopingSingle)
router.route('/cart').get(getCart)
router.route('/profile').get(getProfile)
router.route('/selectAddressAndPayment').get(getSelectAddressAndPayment)
router.route('/removeItemFromCart/:id').get(getRemoveItemFromCart)
router.route('/orders').get(getOrders)
router.route('/orderPlacedStatus').get(getOrderPlacedStatus)
router.route('/wishlist').get(getWishlist)



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

// router.post('/selectAddressAndPayment', async (req, res) => {
//     const { cartTotal } = req.body
//     if (req.session.userLoggedIn) {
//         const userName = req.session.loggedUserName
//         const userId = req.session.loggedUserId

//         const toFindUserAddress = await User.findOne({ _id: userId })
//         const savedAddress = toFindUserAddress.address
//         console.log(savedAddress);


//         res.render('userFiles/paymentAndAddress', { user: true, usersName: userName, userId, savedAddress, cartTotal })
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














router.post('/register', validatingUserRegisterPartOne, validatingUserRegisterPartTwo, async (req, res) => {
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
})



router.post('/verifyOtp', (req, res) => {
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
})




router.post('/login', validatingUserLoginPartOne, validatingUserLoginPartTwo, async (req, res, next) => {
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
})

router.post('/addToCart/:id', async (req, res) => {

    console.log("vannu");

    // res.json({status:true})


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
                    res.json({ status: true })
                    // res.redirect('/cart')    
                } else {
                    //product does not exists in cart, add new item in existing cart
                    console.log("Adding product to existing user");
                    cart.products.push({ productId, productQuantity, productName, productPrice, productImages });
                    cart = await cart.save().then(console.log("Product added "));

                    res.json({ status: true })
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


                res.json({ status: true })

                // res.send()  redirect('/cart')
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    } else {
        console.log("No user");
        res.redirect('/shop')
    }




})

router.post('/changeProductQuantity', async (req, res) => {
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
})







//     console.log(req.body);


//     const userId = req.body.userId
//     const productId = req.body.productId
//     const count = req.body.count
//     console.log(typeof (count));
//     try {
//         let cart = await Cart.findOne({ userId });
//         console.log(cart);
//         if (cart) {
//             //cart exists for user
//             let itemIndex = cart.products.findIndex(p => p.productId == productId);

//             if (itemIndex > -1) {
//                 console.log("incrementing quantity");
//                 //product exists in the cart, update the quantity
//                 let productItem = cart.products[itemIndex];
//                 productItem.productQuantity = productItem.productQuantity + parseInt(count);
//                 cart.products[itemIndex] = productItem;

//             }
//             cart = await cart.save().then(console.log("Product Incremented"));
//             res.redirect('/cart')
//         }

//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Something went wrong");
//     }




// })

router.post('/addAddress', async (req, res) => {
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
})

router.post('/orderPlaced', async (req, res) => {

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



        //    return res.redirect('/orderPlaced')
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
        } else if (req.body.payment === "onlinePayment") {

            function generateRazorpay() {
                instance.orders.create({
                    amount: 50000,
                    currency: "INR",
                    receipt: "newRecipt",
                    // notes: {
                    //   key1: "value3",
                    //   key2: "value2" 
                    // }
                }, (err, order) => {
                    console.log(order);
                    res.json(order)
                })
            }
            generateRazorpay()

            res.json({ paymentType: "onlinePayment" })
        }
    }



})


router.post('/orderPlacedOnlinePayment', (req, res) => {

    console.log("online");


    function generateRazorpay() {
        instance.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "newRecipt",
            // notes: {
            //   key1: "value3",
            //   key2: "value2" 
            // }
        }, (err, order) => {
            console.log(order);
            res.json(order)
        })
    }
    generateRazorpay()



})




router.post('/placeOrder', (req, res) => {
    console.log(req.body);

    if (req.body.paymentMethod === 'onlinePayment') {

        function generateRazorpay() {
            instance.orders.create({
                amount: 50000,
                currency: "INR",
                receipt: "newRecipt",
                // notes: {
                //   key1: "value3",
                //   key2: "value2"
                // }
            }, (err, order) => {
                console.log(order);
                res.json(order)
            })
        }
        generateRazorpay()

        // res.json(true)
    } else {
        res.json(false)
    }

})

router.post('/wishlist/:id', async (req, res) => {
    const productId = req.params.id
    console.log(productId);
    const productIdInObjectId = mongoose.Types.ObjectId(productId)
    console.log(productIdInObjectId);
    const userId = req.session.loggedUserId


    const inWishlist = await Wishlist.findOne({ userId })
    console.log("printing inwishlist");
    console.log(inWishlist);
    console.log("printing inwishlist");

    if(inWishlist != null){

        let findIndex = inWishlist.products.findIndex(p => p.product == productId)
        console.log(findIndex);
        if (findIndex >= 0) {
            inWishlist.products.splice(findIndex, 1)
            await inWishlist.save().then(console.log("Item Removed"));
        } else if (findIndex == -1) {
            // console.log(productId);

            inWishlist.products.push({
                product:productId
            })
          
            inWishlist.save().then((saved) => {
                console.log("Saved to existing user wishlist");
            })
        }
    }else{
        const newWishlist = new Wishlist({
            userId: userId,
            products: [{
                product: productId
            }]
        })
        newWishlist.save().then((saved) => {
            console.log("New wishlist for user");
        })

    }

   




    // const findWishListProduct = await Wishlist.findOne({userId:userId})


    // let itemIndex = findWishListProduct.products.findIndex((p) =>  {
    //     console.log(p.product);
    //     p.product == productIdInObjectId });
    // console.log(itemIndex);

    // return
    // if(findWishListProduct.products)



})

router.post('/verifyPayment', (req, res) => {

    console.log("hey");
    console.log(req.body);

    res.send("hey")
})

router.post('/testing', (req, res) => {
    console.log(req.body);
    // res.send(req.body)
})











// $$$$$$$$$$ Use the below code while using ajax $$$$$$$$$$$$$$$$$$


// router.post('/changeProductQuantity',async(req,res)=>{


//         const userId = req.body.user
//         const productId = req.body.product
//         const count = req.body.count
//         console.log(typeof(count));
//         try {
//             let cart = await Cart.findOne({ userId });
//               console.log(cart);
//             if (cart) {
//               //cart exists for user
//               let itemIndex = cart.products.findIndex(p => p.productId == productId);

//               if (itemIndex > -1) {
//                   console.log("incrementing quantity");
//                 //product exists in the cart, update the quantity
//                 let productItem = cart.products[itemIndex];
//                 productItem.productQuantity = productItem.productQuantity + parseInt(count) ;
//                 cart.products[itemIndex] = productItem;

//               }
//               cart = await cart.save().then(console.log("Product Incremented"));
//               res.status(201).send(cart);
//             }

//           } catch (err) {
//             console.log(err);
//             res.status(500).send("Something went wrong");
//           }




//         console.log(req.body);
//     })













module.exports = router