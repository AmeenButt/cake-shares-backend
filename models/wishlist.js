module.exports = (mongo) => {
    return {
      schema: {
        userId: {
          type: mongo.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        productId: {
          type: mongo.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
      },
      collection: 'wishlist',
    };
  };
  