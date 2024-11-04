const {Products} = require('../Models/ProductsModel')
const {Stores} = require('../Models/StoresModel')
const path = require('path')
const fs = require('fs')
const addProduct = async(req,res)=>{
    const userId = req.user.id
    const {storeId} = req.params
    const{title,description,stock,price} = req.body
    const productImage = req.files? req.files.map(file=>file.filename):[]
    const store = await Stores.findById(storeId)
    if(!store){
        return res.status(404).json("Store not found")
    }

    if(userId !== store.user_id.toString()){
    return res.status(401).json('Not Authorize')
    }
    const product = new Products({
        title:title,
        description:description,
        price:price,
        stock:stock,
        store:storeId,
        productImages: productImage


    })
    if(!store.products){
        store.products = []
    }
    store.products.push(product)
    await store.save()
    await product.save()
     
    
}

const updateProduct = async(req,res)=>{
    const {productId} = req.params
    const {title,description,price,stock,}= req.body
    const product = await Products.findById(productId)
    if(!product){
        return res.status(404).json('Product Not Found')
    }
    product.title = title || product.title
    product.description = description || product.description
    product.price = price || product.price
    product.stock = stock || product.stock

    if(req.files){
        const newImages  = req.files.map(file=>file.filename)
        product.productImages = [...product.productImages,... newImages]
    }
    await product.save()
}

const removeProduct = async(req,res)=>{
    const userId = req.user.id
    const {productId} = req.params
    const product = await Products.findById(productId).populate('store_id')
    if(product && product.store_id.user_id.toString()===userId.toString()){
        if(product.images && product.images.length>0){
          product.images.forEach((image)=>{
            const imagePath = path.join(__dirname, '../uploads/productImages',image)
            fs.unlink(imagePath)
          })
          }  
        await product.deleteOne()  
    }


}

const addReviews = async(req,res)=>{
    const userId = req.user.id
    const {productId} = req.params
    const {rating,comments} = req.body
    const product = await Products.findById()
    if(!product){
        return res.status(404).json('No Product Found')
    }
    if(!product.reviews)[
        product.reviews = []
    ]
    const reviews = {
        user:userId,
        rating:rating,
        comments:comments
    }
    product.reviews.push(reviews)
    if(product.reviews.length>0){
        product.averageRating = product.reviews.reduce((sum,review)=>sum +parseInt(review.rating),0)/product.reviews.length
    }else{
        product.averageRating = 0
    }
    await product.save()

}