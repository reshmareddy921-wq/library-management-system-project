import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
  bookId:{type:mongoose.Schema.Types.ObjectId,ref:'Book',required:true},
  memberId:{type:mongoose.Schema.Types.ObjectId,ref:'Member',required:true},
  issueDate:{type:Date,default:Date.now},
  returnDate:{type:Date},
  status:{type:String,enum:['Issued','Returned'],default:'Issued'}
},{timestamps:true});
export const Transaction = mongoose.model('Transaction',transactionSchema);
