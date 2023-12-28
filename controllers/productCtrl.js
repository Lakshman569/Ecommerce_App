const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const bodyParser = require("body-parser");
const slugify = require('slugify');


const createProduct = asyncHandler(async(req,res) =>{
    try{

        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await  Product.create(req.body);
        res.json(newProduct);

    }
    catch(error){
        throw new Error(error);
    }
   
    
});

// update product

const updateProduct = asyncHandler(async(req,res)=>{
    
  const id = req.params;  

    try{

        if(req.body.title){
            req.body.slug = slugify(req.body.title);

        }

        const updateProduct = await Product.findOneAndUpdate({ id },req.body,{
            new:true,
        });
        
        res.json(updateProduct);

    }catch(error){
        throw new Error(error);
    }
})
// get a single product
const getaProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);

    }
    catch(error){
        throw new Error(error);
    }
});

// get all products

const getAllProduct = asyncHandler(async(req,res)=>{
    try{

        const queryObj = {...req.query};
        const excludefields = ['page','sort','limit','fields'];
        excludefields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g);

        const getallProducts = await Product.find(queryObj);
        res.json(getallProducts);

    }
    catch(error){
        throw new Error(error);
    }
});

// delete Product

const deleteProduct = asyncHandler(async(req,res)=>{
    const id = req.params;
    try{
        const deleteProduct = await Product.findOneAndDelete(id);
        res.json(deleteProduct);
    }catch(error){
        throw new Error(error);
    }
});

// filter











module.exports ={
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
};