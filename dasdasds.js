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