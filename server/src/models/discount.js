import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    code :{
        type :String,
        required :true,
        unique :true,
    },
    discountPercent :{
        type :Number,
        required:true,
    },
    expiresAt : Date,
    usuageLimit : Number,
    useBy : [{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User",
    }],
},{
    timestamps : true,
})

export default mongoose.model("Discount", discountSchema);