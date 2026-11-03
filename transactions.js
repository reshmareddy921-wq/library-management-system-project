import { Router } from 'express';
import { Book } from '../models/Book.js';
import { Member } from '../models/Member.js';
import { Transaction } from '../models/Transaction.js';
const router=Router();
router.get('/',async(_req,res)=>{try{res.json(await Transaction.find().populate('bookId','title author').populate('memberId','name email').sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});}});
router.post('/issue',async(req,res)=>{try{
 const {bookId,memberId}=req.body;if(!bookId||!memberId)return res.status(400).json({message:'Book and member are required'});
 const [book,member]=await Promise.all([Book.findById(bookId),Member.findById(memberId)]);
 if(!book)return res.status(404).json({message:'Book not found'});if(!member)return res.status(404).json({message:'Member not found'});
 if(book.availableQuantity<1)return res.status(400).json({message:'No available copies'});
 book.availableQuantity-=1;await book.save();
 const tx=await Transaction.create({bookId,memberId});res.status(201).json(await tx.populate(['bookId','memberId']));
}catch(e){res.status(400).json({message:e.message});}});
router.put('/:id/return',async(req,res)=>{try{
 const tx=await Transaction.findById(req.params.id);if(!tx)return res.status(404).json({message:'Transaction not found'});
 if(tx.status==='Returned')return res.status(400).json({message:'Book already returned'});
 const book=await Book.findById(tx.bookId);if(book){book.availableQuantity=Math.min(book.quantity,book.availableQuantity+1);await book.save();}
 tx.status='Returned';tx.returnDate=new Date();await tx.save();res.json(await tx.populate(['bookId','memberId']));
}catch(e){res.status(400).json({message:e.message});}});
export default router;
