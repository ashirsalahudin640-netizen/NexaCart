const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

// CREATE PRODUCT
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        // Search
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Category filter
        if (category) {
            filter.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Run both queries at the same time
        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .select("name description price category image stock")
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            Product.countDocuments(filter)
        ]);

        res.status(200).json({
            products,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
            totalProducts
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// UPDATE PRODUCT
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE PRODUCT
router.delete("/:id", protect, adminOnly, async (req, res) => {    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;
