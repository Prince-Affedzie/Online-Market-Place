const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {Users} = require('../Models/UsersModel')
const {Stores} = require('../Models/StoresModel')
const {Products} = require('../Models/ProductsModel')
const {Business} = require('../Models/BusinessModel')
const {Orders} = require('../Models/OrdersModel')
const fs = require('fs')
const path = require('path')

const loginAdmin = async(req,res)=>{
    const {email,password} = req.body
    try{
        if(!email || !password){
            return res.status(401).json('Missing Credentials')
        }
        const user = await Users.findOne({email})
        if(user && user.role === "admin"){
         const isPasswordMatch = await bcrypt.compare(password,user.password)
         if(isPasswordMatch){
            const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_TOKEN,{expiresIn:'1d'})
            res.cookies('accessToken',token,{httpOnly:true,sameSite:'strict', secured:false})
            return res.status(200).json('Login Successful')
         }else{
            return res.status(401).json('Invalid email or Password')
         }

        }else{
            return res.status(401).json('Unauthorized Access')
        }

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
// Admin Manage Users Controllers
const getAllUsers = async(req,res)=>{
    try{
        const users = await Users.find()
        if(!users){
            return res.status(404).json('No Users Found')
        }
        res.status(200).json(users)


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getASingleUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const user = await Users.findById(userId)
        if(!user){
            return res.status(404).json('No User Found')
        }
        res.status(200).json(user)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const addUsers = async(req,res)=>{
    try{
        const {name,email,password,phoneNumber,role} = req.body
        if(!name || !email || !password || !phoneNumber || ! role){
            return res.status(403).json('All fields are required')
        }
        const hashedPassword = await bcrypt.hash(password,8)
        const user = new Users({
          name :name,
          email :email,
          role :role,
          phoneNumber: phoneNumber,
          password: hashedPassword
        })
        await user.save()
        res.status(200).json('User Added Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
const manageUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const {name,email,role,phoneNumber,address} = req.body
        const user = await Users.findById(userId)
        if(!user){
            return res.status(404).json('No User Found')
        }
        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role
        user.phoneNumber = phoneNumber || user.phoneNumber
        user.address = address || user.address
        await user.save()
        res.status(200).json('User updated Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const deleteUser = async(req,res)=>{
    try{
        const {userId} = req.body
        const user = await Users.findById(userId)
        if(!user){
            return res.status(404).json('No User Found')
        }
        if(user && user.profileImage){
            const imagePath = path.join(__dirname, '../uploads/profileImages',user.profileImage)
            fs.unlink(imagePath)
        }
        await user.deleteOne()
        return res.status(200).json('User removed Successfully')
       
    

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
//* Admin Manage Store Controllers
const viewAllStores = async(req,res)=>{
     try{
        const stores = await Stores.find().populate('seller_id')
        .populate('store_products')
        if(!stores){
            return res.status(404).json('No Stores Were Found')
        }
        res.status(200).json(stores)

     }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
     }
}
const viewSingleStore = async(req,res)=>{
    try{
        const {storeId} = req.params
        const store = await Stores.findById(storeId).populate('seller_id')
        .populate('store_products')
        if(!store){
            return res.status(404).json('No Store Found')
        }
        res.status(200).json(store)


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
const deleteStore = async(req,res)=>{
    try{
        const {storeId} = req.body
        const store = await Stores.findById(storeId).populate('store_products')
        if(!store){
            return res.status(404).json('No Store Found')
        }
        if(store && store.store_products.lenght >0){
            for (const product of store.store_products) {
               const product_item = await Products.findById(product._id)
               if(!product_item){
                return res.status(404).json('No Produt Found')
               }
               if(product_item && product_item.images.length>0){
                product_item.images.forEach((image)=>{
                    const imagePath = path.join(__dirname,'../uploads/productImages',image)
                    fs.unlink(imagePath)
                })

               }
               await product_item.deleteOne()
            }
        }

        await store.deleteOne()
        res.status(200).json('Store Removed Successfully')


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server  Error')
    }
}

const switchStoreStatus = async(req,res)=>{
    try{
        const {storeId,status} = req.body
        const store = await Stores.findById(storeId)
       
        if(!store){
            return res.status(404).json('No Store Found')
        }
        store.store_status = status
        await store.save()
        
        const newProductStatus = status ===  'paused'?'paused':'active'
        
        await Products.updateMany(
            {store_id:storeId},
            {$set :{status: newProductStatus}}
        )
        res.status(200).json('Store Status Updated Successfully')



    }catch(err){
        console.log(err)
        res.status(500).json('Internal  Server Error')
    }

}

const updateStore = async(req,res)=>{
    try{
       const {storeId} = req.params
       const {store_name,store_description,store_category,store_location} = req.body
       const store = await Stores.findById(storeId)
       if(!store){
        return res.status(404).json('No Store Found')
       }
       store.store_name = store_name || store.store_name 
       store.store_description = store_description || store.store_description
       store.store_category = store_category || store.store_category
       store.store_location = store_location || store.store_location

       if(req.files['storeLogo']){
        store.store_logo = req.files['storeLogo'][0].filename
       }

       if(req.files['storeBanner']){
        store.store_banner = req.files['storeBanner'][0].filename
       }
      await store.save()
      res.status(200).json('Store Updated Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
// Business Controllers For Admins
const viewAllBusiness = async(req,res)=>{
    try{
        const businesses = await Business.find().populate('businessOwner')
        .populate('stores')
        if(!businesses){
            return res.status(404).json('No businesses found')
        }
        res.status(200).json(businesses )

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const viewSingleBusiness = async(req,res)=>{
    try{
        const {businessId} = req.params
        const business = Business.findById(businessId)
        if(!business){
            return res.status(404).json('No Business Found')
        }
        res.status(200).json(business)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const manageBusinessStatus = async(req,res)=>{
    try{
        const {businessId, status} = req.body
        const business = Business.findById(businessId)
        if(!business){
            return res.status(404).json('No Business Found')
        }
        business.businessStatus = status
        await business.save()
      if(status === "suspended" && business.stores.length >0){
       
        await Stores.updateMany(
            {bussinessAccount : business},
           {$set : {store_status:'paused'}}

        )

        const stores = await Stores.find({bussinessAccount:business})
       for (const store of stores) {
          await Products.updateMany(
            {store_id:store._id},
            {$set : {status : 'paused'}}
          )
       }
      }
      res.status(200).json('Store Status Set Successfully')



    }catch(err){
        console.log(err)
    }

}

const deleteBusiness = async(req,res)=>{
    try{
        const {businessId} = req.body
        const business = Business.findById(businessId)
        if(!business){
            return res.status(404).json('No Business Found')
        }
        if(business.stores.length>0){
            await Stores.updateMany(
                {bussinessAccount:business},
                {$set : {store_status : 'paused'}}
            )
            const stores = Stores.find({bussinessAccount:business})
            for (const store of stores) {
                await Products.deleteMany(
                    {store_id:store._id}
                )
                
            }
        }
        res.status(200).json('Business Account Removed Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}


// Order Controller For Admins
const viewAllOrders = async(req,res)=>{
    try{

      const orders = await Orders.find().populate('buyer_id')
      if(!orders){
        return res.status(404).json('No Orders Found')
      }
      res.status(200).json(orders)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getASingleOrder = async(req,res)=>{
    try{
        const {orderId} = req.params
        const order = await Orders.findById(orderId).populate({
            path : 'items',
              populate:{
               path: 'product_id'
              }
        })
        if(!order){
            return res.status(404).json('No Order Found')
        }
        res.status(200).json(order)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getOrdersOnDailyBasis = async(req,res)=>{
    try{
         const orders = await Orders.aggregate([

            {
                $unwind: "$items"  // Unwind to access items.product_id
            },
            {
                $lookup:{
                   from: 'products',
                   localField: 'items.product_id',
                   foreignField: '_id',
                   as: 'productsDetails'
                }
           },

            {
                $group:{
              _id:{
                id: { _id: "$_id" },
                year:{$year:'$date_ordered'},
                month:{$month:'$date_ordered'},
                day:{ $dayOfMonth : '$date_ordered'}
              },
              items: { $push: "$items" }, // Push items into an array
              date_ordered: { $first: "$date_ordered" }, // Get the first date_ordered for the order
              buyer_id: { $first: "$buyer_id" } // Get the first buyer_id for the order
            }
            
        }, 
       
       
        {
            $sort:{
             '_id.day':1,'_id.month':1
            }
        }
         ])
       
         res.status(200).json(orders)

            
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}

const approveOrder = async(req,res)=>{
    try{


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}




module.exports = {viewAllStores,
    viewSingleStore,loginAdmin,
    addUsers,getAllUsers,getASingleUser,manageUser,
    deleteUser,deleteStore,switchStoreStatus,updateStore,viewAllBusiness,
    viewSingleBusiness,manageBusinessStatus,deleteBusiness,viewAllOrders,getASingleOrder,getOrdersOnDailyBasis}