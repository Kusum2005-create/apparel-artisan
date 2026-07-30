const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");

const { protect } = require("../middleware/authMiddleware");


// Get User Cart
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// Add Product To Cart
router.post("/add", protect, async (req, res) => {

  const { productId, qty } = req.body;

  try {

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message:"Product not found"
      });
    }


    let cart = await Cart.findOne({
      user:req.user._id
    });


    if(!cart){
      cart = new Cart({
        user:req.user._id,
        items:[]
      });
    }


    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );


    if(existingItem){

      existingItem.qty += qty;

    }else{

      cart.items.push({
        product: product._id,
        name: product.name,
        qty: qty,
        price: product.price,
        image: product.imageUrl
      });

    }


    await cart.save();

    res.json(cart);


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});


// Remove Product From Cart
router.delete("/remove/:productId", protect, async(req,res)=>{

try{

const cart = await Cart.findOne({
 user:req.user._id
});


cart.items = cart.items.filter(
 item => item.product.toString() !== req.params.productId
);


await cart.save();


res.json(cart);


}catch(error){

res.status(500).json({
message:error.message
});

}

});


// Update Quantity
router.put("/update/:productId", protect, async(req,res)=>{

try{

const cart = await Cart.findOne({
 user:req.user._id
});


const item = cart.items.find(
 item => item.product.toString() === req.params.productId
);


if(!item){
 return res.status(404).json({
 message:"Item not found"
 });
}


item.qty = req.body.qty;


await cart.save();


res.json(cart);


}catch(error){

res.status(500).json({
message:error.message
});

}

});


module.exports = router;
