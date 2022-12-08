require('dotenv').config()
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { handleAsync } = require('../middleware/handlingAsync/handleAsync');
const Banner = require('../models/bannerModel');
const Order = require('../models/orderModel');
const Coupon = require('../models/couponModel');
const { deleteOne } = require('../models/orderModel');
var ObjectId = require('mongodb').ObjectID;




exports.getAdminLogin = (req, res) => {
    res.render('adminFiles/adminLogin')
}

exports.getAdminDashboard = async (req, res, next) => {

    let salesCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    const salesData = await Order.aggregate([
        {
            '$unwind': {
                'path': '$orders'
            }
        },
        {
            '$project':
            {
                year: { $year: "$orders.orderedDate" },
                month: { $month: "$orders.orderedDate" },

            }
        },
    ])
    // console.log(salesData);

    for (month of salesData) {
        let whichMonth = month.month
        console.log(typeof (whichMonth));
        salesCount[whichMonth - 1] = salesCount[whichMonth - 1] + 1
    }

    // console.log(salesCount);

    let codCount = 0
    let onlineCount = 0

    const paymentMode = await Order.aggregate([
        {
            '$unwind': {
                'path': '$orders'
            }
        },
        {
            '$project':
            {
                "orders.paymentMethod": 1

            }
        },
    ])
    console.log(paymentMode);
    for (mode of paymentMode) {
        let whichMode = mode.orders.paymentMethod

        if (whichMode === 'cod') {
            codCount = codCount + 1
        } else if (whichMode === 'online') {
            onlineCount = onlineCount + 1
        }

        // salesCount[whichMonth - 1] = salesCount[whichMonth - 1] + 1
    }
    console.log(onlineCount);
    console.log(codCount);

    const users = await User.find({})
    const usersCount = users.length


    let pendingCount = 0
    let packedCount = 0
    let shippedCount = 0
    let deliveredCount = 0

    const pendingOrders = await Order.aggregate([
        {
            '$unwind': {
                'path': '$orders'
            }
        },
        {
            '$project':
            {
                "orders.status": 1

            }
        },
    ])

    console.log(pendingOrders);
    for (orderStatus of pendingOrders) {
        let whichStatus = orderStatus.orders.status

        if (whichStatus === 'Pending') {
            pendingCount = pendingCount + 1
        } else if (whichStatus === 'Packed') {
            packedCount = packedCount + 1
        }
        else if (whichStatus === 'Shipped') {
            shippedCount = shippedCount + 1
        }
        else if (whichStatus === 'Delivered') {
            deliveredCount = deliveredCount + 1
        }
    }

    console.log(pendingCount);
    console.log(packedCount);
    console.log(shippedCount);
    console.log(deliveredCount);

    const admin = await Admin.find({})
    const adminMail = admin[0].email
    console.log(admin[0].email);


    res.render('adminFiles/showDashboard', { dashboard: true, users: false, products: false, category: false, banner: false, order: false, coupon: false, salesCount, codCount, onlineCount, usersCount, pendingCount, packedCount, shippedCount, deliveredCount, adminMail })
}

exports.getAdminUsers = handleAsync(async (req, res) => {

    const listOfUsers = await User.find({})
    console.log(listOfUsers);
    res.render('adminFiles/showUsers', { dashboard: false, users: true, products: false, category: false, banner: false, order: false, coupon: false, allUsers: listOfUsers })

})


exports.getUserBlock = handleAsync(async (req, res, next) => {
    const userId = req.params.id
    User.updateOne({ _id: userId }, { $set: { access: false } }).then(
        console.log("user Blocked"),
        res.redirect('/admin/showUsers')
    )
})

exports.getUserUnblock = handleAsync(async (req, res, next) => {
    const userId = req.params.id
    User.updateOne({ _id: userId }, { $set: { access: true } }).then(
        console.log("user Unblocked"),
        res.redirect('/admin/showUsers'))
})

exports.getShowProduct = handleAsync(async (req, res, next) => {

    const allProducts = await Product.find({ status: true })

    console.log(allProducts)
    res.render('adminFiles/showProducts', { dashboard: false, users: false, products: true, category: false, banner: false, order: false, coupon: false, allProducts })

})

exports.getShowCategory = handleAsync(async (req, res) => {
    const allCategories = await Category.find({})
    console.log(allCategories);
    res.render('adminFiles/showCategory', { dashboard: false, users: false, products: false, category: true, banner: false, order: false, coupon: false, allCategories })
})

exports.getShowSpecificCategory = handleAsync(async (req, res) => {
    const categoryId = req.params.id
    const allProducts = await Product.find({ productCategory: categoryId })
    if (allProducts.length > 0) {
        res.render('adminFiles/showSpecificCategory', { dashboard: false, users: false, products: false, category: true, banner: false, order: false, coupon: false, allProducts })
    }
    else {
        res.send("No products")
    }
})

exports.getAddProducts = handleAsync(async (req, res) => {
    const allCategories = await Category.find({})
    res.render('adminFiles/addProduct', { dashboard: false, users: false, products: true, category: false, banner: false, order: false, coupon: false, allCategories })
})

exports.getEditProduct = handleAsync(async (req, res) => {
    const productId = req.params.id
    console.log(productId);
    const allCategories = await Category.find({})
    console.log(allCategories);
    const productToEdit = await Product.findById(productId)
    console.log(productToEdit);
    const nameOfCategory = await Category.findById(productToEdit.productCategory)
    console.log(nameOfCategory);
    res.render('adminFiles/editProduct', { dashboard: false, users: false, products: true, category: false, banner: false, order: false, coupon: false, allCategories, prodectTobeEdited: productToEdit, nameOfCategory })
})

exports.getAddBanner = async (req, res) => {

    const allBanners = await Banner.find({})

    console.log(allBanners);
    res.render('adminFiles/addAndShowBanner', { dashboard: false, users: false, products: false, category: false, banner: true, order: false, coupon: false, allBanners })
}

exports.postDeleteProduct = handleAsync(async (req, res) => {
    let deletingProductId = req.params.id

    const deletedProduct = await Product.findByIdAndDelete(deletingProductId)
    console.log(deletedProduct);

    res.redirect('/admin/showProducts')
})

exports.getShowOrders = async (req, res) => {



    // const allOrdersOfUsers = await Order.find({})

    // console.log(allOrdersOfUsers);
    // console.log(allOrdersOfUsers[0]);

    // allOrdersOfUsers.forEach(user=>{
    //     console.log(user.reverse());
    // })  orders[0].orderedDate.reverse());




    // const allOrdersOfUsers = await Order.aggregate([
    //     {
    //       '$unwind': {
    //         'path': '$orders'
    //       }
    //     }
    //   ])

    //   console.log(allOrdersOfUsers);
    const allOrdersOfUsers = await Order.aggregate([
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



    console.log(allOrdersOfUsers);
    // console.log(allOrdersOfUsers[0]);

    res.render('adminFiles/showOrders', { dashboard: false, users: false, products: false, category: false, banner: false, order: true, coupon: false, allOrdersOfUsers })
}
exports.getShowCoupon = async (req, res) => {

    const allCoupons = await Coupon.find({})
    console.log(allCoupons);


    res.render('adminFiles/addAndShowCoupons', { dashboard: false, users: false, products: false, category: false, banner: false, order: false, coupon: true, allCoupons })
}

exports.getLogOut = (req, res) => {
    req.session.adminLoggedIn = false
    res.redirect('/admin')
}

exports.getDetailsOfEachOrders = async (req, res) => {

    const userId = req.params.userId
    const orderId = req.params.orderId

    const userIdInObjectId = new ObjectId(userId)
    const orderIdInObjectId = new ObjectId(orderId)




    const userOfOrder = await Order.find({ userId })

    const userIdOfTheUser = userOfOrder[0].userId
    console.log(userIdOfTheUser);

    let indexOfThisProduct = userOfOrder[0].orders.findIndex(index => index._id == orderId)

    // console.log(indexOfThisProduct);

    const orderToDisplay = userOfOrder[0].orders[indexOfThisProduct]

    console.log(orderToDisplay);

    let productsOfOrders = userOfOrder[0].orders[indexOfThisProduct].products

    const orderStatus = await Order.aggregate([
        {
            '$match': {
                'userId': userIdInObjectId
            }
        }, {
            '$unwind': {
                'path': '$orders'
            }
        }, {
            '$match': {
                'orders._id': orderIdInObjectId
            }
        }, {
            '$project': {
                'orders.status': 1
            }
        }
    ])

    console.log(orderStatus);

    const orderStatusToDisplay = orderStatus[0].orders.status

    console.log(orderStatusToDisplay);

    res.render('adminFiles/showDetailesOfEachOrders', { dashboard: false, users: false, products: false, category: false, banner: false, order: true, coupon: false, orderToDisplay, userIdOfTheUser, orderStatusToDisplay })
}



// POST




exports.postAdminLogin = handleAsync(async (req, res) => {
    console.log(req.body);
    const { adminMail, adminPassword } = req.body
    const checkingInDB = await Admin.find({ email: adminMail })
    if (checkingInDB.length > 0) {
        if (checkingInDB[0].password === adminPassword) {
            req.session.adminLoggedIn = true
            res.redirect('/admin/showDashboard')
        }
        else {
            console.log("Paasword Incorrect");
            res.redirect('/admin')
        }
    } else {
        console.log("No such user");
        res.redirect('/admin')
    }
})

exports.postAddProduct = (req, res) => {

    try {
        const imgNames = []

        for (let imgName of req.files) {
            let name = imgName.filename
            console.log(name);
            imgNames.push(name)
        }

        console.log(imgNames);
        const newProduct = new Product({
            productName: req.body.productName,
            productCategory: req.body.productCategory,
            productDescription: req.body.productDescription,
            productQuantity: req.body.productQuantity,
            productPrice: req.body.productPrice,
            productImages: imgNames,
        })

        newProduct.save().then(() => {
            req.flash("productSaved", "New product created")
            console.log("Saved");

        }).catch((err) => {
            console.log(err);
        })
        res.redirect("/admin/addproduct")
    } catch (err) {
        console.log(err);
        console.log("Somthing wrong");

    }

}

exports.postEditProduct = handleAsync(async (req, res) => {
    console.log(req.body)
    const productId = req.params.id
    const { productName, productCategory, productQuantity, productPrice, productDescription, } = req.body

    const imgNames = []

    for (let imgName of req.files) {
        let name = imgName.filename
        // console.log(name);
        imgNames.push(name)
    }

    console.log(imgNames);

    const updateProduct = await Product.updateOne({ _id: productId }, { $set: { productName, productPrice, productQuantity, productCategory, productDescription, productImages: imgNames } })


    console.log(updateProduct);
    res.redirect('/admin/showProducts')
})

exports.postAddCategory = (req, res) => {
    // router.post('/addCategory',(req,res)=>{

    console.log(req.body);
    const categoryImage = req.file.filename
    console.log(categoryImage);
    const newCategoryName = req.body.category
    const categoryInUpper = newCategoryName.toUpperCase()
    let haveSameCategory = false
    Category.find({}, (err, allCategories) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(allCategories);


            allCategories.forEach((names) => {
                if (categoryInUpper === names.categoryName) {
                    haveSameCategory = true

                    // flash
                }
            })
            if (haveSameCategory) {
                // flash
                console.log("Same category exist");
                res.redirect('/admin/showCategory')

            } else {

                const newCategory = Category({
                    categoryName: categoryInUpper,
                    categoryImage: categoryImage
                })
                newCategory.save().then((saved) => {
                    console.log(saved);
                    res.redirect('/admin/showCategory')
                }).catch((err) => {
                    res.redirect('/admin/showCategory')
                    console.log(err);
                })
            }


        }
    })
}

exports.postAddBanner = (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const bannerImage = req.file.filename
    const { bannerMainHeading, bannerSubHeading, bannerDescription } = req.body

    const newBanner = new Banner({
        bannerMainHeading,
        bannerSubHeading,
        bannerDescription,
        bannerImage
    })

    newBanner.save().then(console.log("Banner Added"))
    res.redirect('/admin/addBanner')

}

exports.postAddCoupon = (req, res) => {

    const { code, percentage, quantity } = req.body
    console.log(req.body);

    const newCoupon = new Coupon({
        code,
        percentage,
        quantity
    })

    newCoupon.save().then(console.log("Saved Coupon"))

    res.redirect('/admin/showCoupon')



}

