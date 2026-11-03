import { Router } from 'express';
import { Book } from '../models/Book.js';
import { Transaction } from '../models/Transaction.js';
const router=Router();
router.get('/',async(_req,res)=>{try{res.json(await Book.find().sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});}});
router.post('/',async(req,res)=>{try{
 const {title,author,category,isbn,quantity}=req.body;
 if(!title||!author) return res.status(400).json({message:'Title and author are required'});
 const q=Number(quantity ?? 1); if(q<0) return res.status(400).json({message:'Quantity cannot be negative'});
 const book=await Book.create({title,author,category,isbn,quantity:q,availableQuantity:q}); res.status(201).json(book);
}catch(e){res.status(400).json({message:e.message});}});
router.put('/:id',async(req,res)=>{try{
 const book=await Book.findById(req.params.id); if(!book)return res.status(404).json({message:'Book not found'});
 const {title,author,category,isbn,quantity}=req.body;
 if(title!==undefined)book.title=title;if(author!==undefined)book.author=author;if(category!==undefined)book.category=category;if(isbn!==undefined)book.isbn=isbn;
 if(quantity!==undefined){const q=Number(quantity);const issued=book.quantity-book.availableQuantity;if(q<issued)return res.status(400).json({message:'Quantity cannot be less than currently issued copies'});book.quantity=q;book.availableQuantity=q-issued;}
 await book.save();res.json(book);
}catch(e){res.status(400).json({message:e.message});}});
router.delete('/:id',async(req,res)=>{try{
 const active=await Transaction.exists({bookId:req.params.id,status:'Issued'});if(active)return res.status(400).json({message:'Cannot delete a book while copies are issued'});
 const book=await Book.findByIdAndDelete(req.params.id);if(!book)return res.status(404).json({message:'Book not found'});res.json({message:'Book deleted'});
}catch(e){res.status(500).json({message:e.message});}});
export default router;
