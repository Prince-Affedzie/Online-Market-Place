const express = require('express')
const admin_router = express.Router()
const {viewAllStores,viewSingleStore,loginAdmin,addUsers,getAllUsers,
    manageUser,viewAllOrders,getASingleOrder,getOrdersOnDailyBasis} = require('../Controllers/adminsController')

admin_router.get('/marketplace/admin/getallstores',viewAllStores)
admin_router.get('/marketplace/admin/getallusers',getAllUsers)
admin_router.get('/marketplace/admin/getstore/:storeId',viewSingleStore)
admin_router.post('/marketplace/admin/login', loginAdmin,)
admin_router.post('/marketplace/admin/adduser',addUsers)
admin_router.put('/marketplace/admin/manageuser/:userId',manageUser)

admin_router.get('/marketplace/admin/getallorders',viewAllOrders)
admin_router.get('/marketplace/admin/getsingleorder/:orderId',getASingleOrder)
admin_router.get('/marketplace/admin/getordersondailybasis',getOrdersOnDailyBasis)

module.exports = admin_router