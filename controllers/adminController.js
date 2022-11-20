require('dotenv').config()
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { handleAsync } = require('../middleware/handlingAsync/handleAsync');
const Banner = require('../models/bannerModel');





exports.getAdminLogin = (req, res) => {
    res.render('adminFiles/adminLogin')
}

exports.getAdminDashboard = (req, res, next) => {
    res.render('adminFiles/showDashboard', { dashboard: true, users: false, products: false, category: false, banner: false })
}

exports.getAdminUsers = handleAsync(async (req, res) => {

    const listOfUsers = await User.find({})
    console.log(listOfUsers);
    res.render('adminFiles/showUsers', { dashboard: false, users: true, products: false, category: false, banner: false, allUsers: listOfUsers })

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

    const allProducts = await Product.find({})

    console.log(allProducts),
        res.render('adminFiles/showProducts', { dashboard: false, users: false, products: true, category: false, banner: false, allProducts })

})

exports.getShowCategory = handleAsync(async (req, res) => {
    const allCategories = await Category.find({})
    console.log(allCategories);
    res.render('adminFiles/showCategory', { dashboard: false, users: false, products: false, category: true, banner: false, allCategories })
})

exports.getShowSpecificCategory = handleAsync(async (req, res) => {
    const categoryId = req.params.id
    const allProducts = await Product.find({ productCategory: categoryId })
    if (allProducts.length > 0) {
        res.render('adminFiles/showSpecificCategory', { dashboard: false, users: false, products: false, category: true, banner: false, allProducts })
    }
    else {
        res.send("No products")
    }
})

exports.getAddProducts = handleAsync(async (req, res) => {
    const allCategories = await Category.find({})
    res.render('adminFiles/addProduct', { dashboard: false, users: false, products: true, category: false, banner: false, allCategories })
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
    res.render('adminFiles/editProduct', { dashboard: false, users: false, products: true, category: false, banner: false, allCategories, prodectTobeEdited: productToEdit, nameOfCategory })
})

exports.getAddBanner = async (req, res) => {
   
    const allBanners = await Banner.find({})

    console.log(allBanners);
    res.render('adminFiles/addAndShowBanner', { dashboard: false, users: false, products: false, category: false, banner: true,allBanners})
}

exports.postDeleteProduct = handleAsync(async (req, res) => {
    let deletingProductId = req.params.id

    const deletedProduct = await Product.findByIdAndDelete(deletingProductId)
    console.log(deletedProduct);

    res.redirect('/admin/showProducts')
})



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

exports.postEditProduct = handleAsync(async(req,res)=>{
    console.log(req.body)
        const productId = req.params.id 
        const {productName,productCategory,productQuantity,productPrice,productDescription,} = req.body
       
        const imgNames = []
    
            for (let imgName of req.files) {
                let name = imgName.filename
                // console.log(name);
                imgNames.push(name)
            }
    
            console.log(imgNames);
    
            const updateProduct = await Product.updateOne({_id:productId},{$set:{productName,productPrice,productQuantity,productCategory,productDescription,productImages:imgNames}})
    
    
            console.log(updateProduct);
            res.redirect('/admin/showProducts')
})

exports.postAddCategory = (req,res)=>{
    // router.post('/addCategory',(req,res)=>{

            console.log(req.body);
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
        // })
}

exports.postAddBanner = (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const bannerImage = req.file.filename
    const {bannerMainHeading,bannerSubHeading,bannerDescription} = req.body

    const newBanner = new Banner({
        bannerMainHeading,
        bannerSubHeading,
        bannerDescription,
        bannerImage
    })

    newBanner.save().then(console.log("Banner Added"))
    res.redirect('/admin/addBanner')

}   