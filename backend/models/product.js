// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;
// var productSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     image: {
//       type: String,
//       // required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     category: { 
//         type: Schema.Types.ObjectId,
//         ref: 'Category' 
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     ownedBy: {
//       type: mongoose.Types.ObjectId,
//       ref: 'Users',
//     },
//     attributeSets: [
//       [
//         {
//           name: String,
//           value: String,
//         },
//       ],
//     ],
//     },
//   {
//     timestamps: true,
//   }
// );

// export default model('Products', productSchema);



import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const attributeSchema = new Schema({
  name: { type: String, required: true },
  value: Schema.Types.Mixed,
});

const productSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    image: {
      type: String,
      required: true,
    },    

    category: { 
      type: Schema.Types.ObjectId,
      ref: 'Category' 
      },
    description: { 
      type: String, 
      required: true 
    },

    ownedBy: { 
      type: mongoose.Types.ObjectId, 
      ref: 'Users' 
    },
    attributeSets: [
      [
        attributeSchema,
      ],
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.path('attributeSets').validate(function(value) {
  return value.every(set => set.every(attribute => typeof attribute.value === 'string' || typeof attribute.value === 'number'));
}, 'Invalid data type for attribute value.');

export default model('Products', productSchema);
