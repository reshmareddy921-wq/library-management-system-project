import mongoose from 'mongoose';
const memberSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,trim:true},
  phone:{type:String,default:''},
  membershipDate:{type:Date,default:Date.now}
},{timestamps:true});
export const Member = mongoose.model('Member',memberSchema);
