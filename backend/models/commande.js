import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const commandeItemSchema = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Products',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const commandeSchema = new Schema(
  {
    items: [commandeItemSchema], // Utilisez un tableau d'objets pour stocker plusieurs produits avec quantités
    clientId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    statusCommande: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Commandes', commandeSchema);
