const {Stores} = require('../Models/StoresModel')
const Sale = require('../Models/SalesModel')
const {ObjectId} = require('mongoose')

const getAllStoresSales = async(req,res)=>{
    try{
        const userId = req.user.id
        const stores = await Stores.find({seller_id:userId})
        if(! stores){
            return res.status(404).json('No Stores Found')
        }
        const sales = promise.all( stores.map(async(store)=>{
            const sale = await Sale.find({store:store._id})
            const totalSale = sale.length>0? sale.reduce((acc,current)=> acc + parseInt(current.amount),0):0
            return{
                store,totalSale
            }

        })
       

        )
        res.status(200).json(sales)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}


const getSingleStoreSales = async()=>{
    try{
        const {storeId} = req.params
        const userId = req.user.id
        const store = await Stores.findById(storeId)
       if(store && store.seller_id.toString()===userId.toString()){
         const sales = await Sale.aggregate([

            {
                $match:{
                    store: new ObjectId(storeId)
                }
            },
           
            {
                $group:{
                    _id:{
                      year: { $year:'$date'},
                      month: {$month:'$date'}
                    }
                }
            },
            {
                $sort:{
                    "_id.year":1,"_id.month":1
                }
            }
         ])

         if(!sales){
            return res.status(404).json('No sales found')
         }
         res.status(200).json(sales)
       }else{
        return res.status(404).json('No Store Found')
       }



    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}