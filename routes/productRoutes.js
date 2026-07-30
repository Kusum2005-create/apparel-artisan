const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");


// @desc Get all products
// @route GET /api/products
// @access Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// @desc Get single product
// @route GET /api/products/:id
// @access Public
router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if(product){
      res.json(product);
    }
    else{
      res.status(404).json({
        message:"Product not found"
      });
    }

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
});



// @desc Create product
// @route POST /api/products
// @access Admin
router.post("/", protect, admin, async(req,res)=>{

  try{

    const product = await Product.create(req.body);

    res.status(201).json(product);

  }
  catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});



// @desc Update product
// @route PUT /api/products/:id
// @access Admin
router.put("/:id", protect, admin, async(req,res)=>{

  try{

    const product = await Product.findById(req.params.id);


    if(product){

      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.imageUrl = req.body.imageUrl || product.imageUrl;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;


      const updatedProduct = await product.save();

      res.json(updatedProduct);

    }
    else{

      res.status(404).json({
        message:"Product not found"
      });

    }


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});



// @desc Delete product
// @route DELETE /api/products/:id
// @access Admin
router.delete("/:id", protect, admin, async(req,res)=>{

  try{

    const product = await Product.findById(req.params.id);


    if(product){

      await product.deleteOne();

      res.json({
        message:"Product removed"
      });

    }
    else{

      res.status(404).json({
        message:"Product not found"
      });

    }


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});



module.exports = router;