const router = require("express").Router();
const Product = require("../models/Product");
const verifyToken = require("../tokenValidation");

//Get all Products
router.get("/", verifyToken, async (req, res) => {
    try {
        const getProducts = await Product.find();
        res.json(getProducts);
    } catch (err) {
        res.json({ message: err });
    }
});

//Get Specific product
router.get("/:productId", verifyToken, async (req, res) => {
    try {
        const getProduct = await Product.findById(req.params.productId);
        res.json(getProduct);
    } catch (err) {
        res.json({ message: err });
    }
});

//Insert(post) product in DB
router.post("/", verifyToken, async (req, res) => {
    const product = new Product({
        _id: req.body._id,
        Name: req.body.Name,
        Price: req.body.Price,
        Category: req.body.Category,
    });

    try {
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (err) {
        res.json({ message: err });
    }
});

//Delete product from DB
router.delete("/:productId", verifyToken, async (req, res) => {
    try {
        const deleteProduct = await Product.deleteOne({
            _id: req.params.productId,
        });
        res.json(deleteProduct);
    } catch (err) {
        res.json({ message: err });
    }
});

//Update product
router.patch("/:productId", verifyToken, async (req, res) => {
    try {
        const updateProduct = await Product.updateOne(
            { _id: req.params.productId },
            {
                $set: {
                    Name: req.body.Name,
                    Price: req.body.Price,
                    Category: req.body.Category,
                    UpdatedDate: Date.now(),
                },
            }
        );
        res.json(updateProduct);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
