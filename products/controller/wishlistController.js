const { default: mongoose } = require('mongoose');
const { createNotification } = require('../helper');

const { USER, PRODUCT, WISHLIST } = global;

module.exports = {
    addToWishlist: async (req, res) => {
        const { userId, productId } = req.body;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        const product = await PRODUCT.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }

        const wishlistItem = await WISHLIST.findOne({ userId, productId });
        if (wishlistItem) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist!' });
        }

        await WISHLIST.create({ userId, productId });

        const notificationData = {
            actionType: 'wishlist_added',
            title: 'Added to Wishlist!',
            message: [`"${product.productName}" has been added to your wishlist.`],
        };

        await createNotification([userId], notificationData, [], {
            [`${user.type}Notification`]: true,
        });

        return res.status(200).json({ success: true, message: 'Product added to wishlist!' });
    },

    removeFromWishlist: async (req, res) => {
        const { userId, productId } = req.body;

        const wishlistItem = await WISHLIST.findOneAndDelete({ userId, productId });

        if (!wishlistItem) {
            return res.status(404).json({ success: false, message: 'Product not found in wishlist!' });
        }

        return res.status(200).json({ success: true, message: 'Product removed from wishlist!' });
    },

    getUserWishlist: async (req, res) => {
        const { userId } = req.params;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        const wishlist = await WISHLIST.find({ userId }).populate({
            path: 'productId',
            populate: { path: 'investmentType' } // Populate investmentType inside productId
          })
          .exec()

        return res.status(200).json({
            success: true,
            message: 'Wishlist retrieved successfully!',
            wishlist,
        });
    },

    isInWishlist: async (req, res) => {
        const { productId, userId } = req.body;
        console.log("productId")
        if(!productId || !userId){
            return res.status(200).json({ success: false, message: 'Item does not exists' });
        }
        console.log("!")
        const foundItem = await WISHLIST.findOne({ $and: [{ userId:  userId }, { productId }] });
        console.log("3")
        if (!foundItem) {
            return res.status(200).json({ success: false, message: 'Item does not exists' });
        }

        return res.status(200).json({
            success: true,
            message: 'Item Exists',
            foundItem,
        });
    },
};
