import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const STATUS_ORDER_VALUES = ['En Cours', 'Terminé', 'Annulé'];

const orderItemSchema = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Products', // Référence au modèle de produit
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  attributes: [
    {
      name: String,
      value: String,
    }
  ],
});

const orderSchema = new Schema(
  {
    commandeId: {  // Ajoutez ce champ pour stocker l'ID de la commande
      type: mongoose.Types.ObjectId,
      ref: 'Commandes', // Référence au modèle de commande
    },
    items: [orderItemSchema],
    clientId: {
      type: mongoose.Types.ObjectId,
      ref: 'Users', // Référence au modèle d'utilisateur (client)
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    statusOrder: {
      type: String,
      enum: STATUS_ORDER_VALUES,
      default: 'En Cours', // Définissez la valeur par défaut ici
    },
  },
  {
    timestamps: true,
  }
);

export default model('Orders', orderSchema);