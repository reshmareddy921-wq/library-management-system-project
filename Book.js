import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  author:{type:String,required:true,trim:true},
  category:{type:String,default:'General'},
  isbn:{type:String,default:''},
  quantity:{type:Number,required:true,min:0,default:1},
  availableQuantity:{type:Number,min:0,default:1}
},{timestamps:true});
export const Book = mongoose.model('Book',bookSchema);
