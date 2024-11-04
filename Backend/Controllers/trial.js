const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
   
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type: Number,
        required:true
    },
    productImages:[

    ],
    store:{
        type: Schema.Types.ObjectId,
        ref:'Stores',
        required: true
    },
    reviews:[{
        user:{
            type: Schema.Types.ObjectId,
        },
        rating:{
            type: Number,

        },
        comments:{
            type: String
        },
        date:{
            type: Date,
            default:Date.now()
        }
    }],
    averageReating:{
        type:Number,
        default:0
    }


})

mongoose.model('Products',productSchema)