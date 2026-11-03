import { Router } from 'express';
import { Member } from '../models/Member.js';
import { Transaction } from '../models/Transaction.js';
const router=Router();
router.get('/',async(_req,res)=>{try{res.json(await Member.find().sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});}});
router.post('/',async(req,res)=>{try{const {name,email,phone}=req.body;if(!name||!email)return res.status(400).json({message:'Name and email are required'});res.status(201).json(await Member.create({name,email,phone}));}catch(e){res.status(400).json({message:e.message});}});
router.put('/:id',async(req,res)=>{try{const m=await Member.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!m)return res.status(404).json({message:'Member not found'});res.json(m);}catch(e){res.status(400).json({message:e.message});}});
router.delete('/:id',async(req,res)=>{try{const active=await Transaction.exists({memberId:req.params.id,status:'Issued'});if(active)return res.status(400).json({message:'Member has an active issued book'});const m=await Member.findByIdAndDelete(req.params.id);if(!m)return res.status(404).json({message:'Member not found'});res.json({message:'Member deleted'});}catch(e){res.status(500).json({message:e.message});}});
export default router;
