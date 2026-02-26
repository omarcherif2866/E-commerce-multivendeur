import Products from '../models/product.js';
import cloudinary from 'cloudinary';


import { validationResult } from "express-validator";
import mongoose from 'mongoose';



  export function addOnceProduct(req, res) {
          // Vérification de l'image de profil
      const imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({ message: 'Please upload an image' });
      }
    const attributes = JSON.parse(req.body.attributeSets); // Parsez la chaîne JSON ici
      // const attributes = req.body.attributeSets;
    console.log(attributes);
  
    // Validez les données reçues
    if (!attributes || !Array.isArray(attributes)) {
      return res.status(400).json({ error: 'Invalid attributeSets data' });
    }
  
    // Créez un tableau pour stocker les ensembles d'attributs
    const attributeSets = [];
    let currentSet = [];
  
    attributes.forEach((attribute) => {
      const { name, value } = attribute;
  
      // Si la clé est "stock", commencez un nouvel ensemble d'attributs
      if (name === 'stock') {
        if (currentSet.length > 0) {
          attributeSets.push(currentSet);
        }
        currentSet = [];
      }
  
      // Ajoutez l'attribut à l'ensemble d'attributs actuel
      if (name === 'stock') {
        currentSet.push({ name: name, value: Number(value) || 0 });
      } else {
        currentSet.push({ name: name, value: String(value) });
      }
    });
  
    // Assurez-vous d'ajouter le dernier ensemble d'attributs
    if (currentSet.length > 0) {
      attributeSets.push(currentSet);
    }
  
    const productData = {
      name: req.body.name,
      price: req.body.price,
      // quantity: req.body.quantity,
      category: req.body.category,
      description: req.body.description,
      // status: req.body.status,
      ownedBy: req.params.vendorId,
      image: imageFile.path,
      attributeSets: attributeSets,
    };
  
    Products.create(productData)
      .then((newProduct) => {
        console.log('Nouveau produit avec ensembles d\'attributs :');
        console.log(newProduct);
        res.status(200).json(newProduct);
            // const transporter = nodemailer.createTransport({
            //   // Configuration du service d'envoi d'e-mails (par exemple, Gmail)
            //   service: 'gmail',
            //   auth: {
            //     user: 'comar2866@gmail.com',
            //     pass: 'omar omar',
            //   },
            //   tls: {
            //     rejectUnauthorized: false,
            //   },
            // });
      
            // const mailOptions = {
            //   from: 'comar2866@gmail.com',
            //   to: 'comar2866@gmail.com',
            //   subject: 'New Product Publication',
            //   html: `
            //     <p>Hello Admin,</p>
            //     <p>A new product has been published:</p>
            //     <p>Product Name: ${newProduct.name}</p>
            //     <p>Product Category: ${newProduct.category}</p>
            //     <p>Please confirm the product publication by clicking on the following link:</p>
            //     <p>http://localhost:9090/user/confirm-product/${newProduct._id}</p>
            //   `,
            // };
      
            // console.log("Sending confirmation email");
            // transporter.sendMail(mailOptions, (error, info) => {
            //   if (error) {
            //     console.error("Error sending email:", error);
            //   } else {
            //     console.log('Email sent: ' + info.response);
            //   }
            // });
          })
          .catch((err) => {
            res.status(500).json({ error: err }); // Utilisez le code 500 pour une erreur interne du serveur
          });
      }
  


export function getAll(req, res) {
  console.log(req.params.vendorId);

  Products
    .find({ ownedBy: req.params.vendorId })
    .populate('category') // ✅
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
}

export async function Deleteproduct(req, res) {
  const id =req.params.id
  const product = await Products.findByIdAndDelete(id);
  res.status(200).json({"message":"deleted"});
}

export function getProductById(req, res) {
  Products.findById(req.params.id)
    .populate('category') // ✅
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
}

export function putOnce(req, res) {
        const newProduct = {
          name: req.body.name,
          price: req.body.price,
          // quantity: req.body.quantity,
          category: req.body.category,
          description: req.body.description,
          // status: req.body.status,
        };
      
        if (req.file) {
          // Si une image est fournie, ajoutez le champ "image" au nouvel objet produit
          newProduct.image =`${req.file.filename}`;
        }
      
        Products.findByIdAndUpdate(req.params.id, newProduct)
          .then((doc1) => {
                res.status(200).json(doc1);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
}
      

export function getProductsByCategory(req, res) {
  const category = req.params.categoryId;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;

  Products.find({ category })
    .populate('category') // ✅
    .limit(limit)
    .sort({ _id: sort })
    .then(plats => {
      res.json(plats);
    })
    .catch(err => console.log(err));
}


export function getAllProducts(req, res) {
  Products.find({})
    .populate('category') // ✅ déjà présent
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
}


export function getProductByVendor(req, res) {
  const ownedBy = req.params.vendorId;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;

  Products.find({ ownedBy })
    .populate('category') // ✅
    .limit(limit)
    .sort({ id: sort })
    .then(products => {
      res.json(products);
    })
    .catch(err => console.log(err));
}


export async function getAttributeByCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;

    // Utilisez une requête pour trouver les produits de la catégorie
    const products = await Products.find({ category: categoryId });

    // Vérifiez si des produits ont été trouvés
    if (products) {
      // Créez un ensemble pour stocker les noms uniques des sous-attributs
      const uniqueSubAttributes = new Set();

      // Parcourez les produits et examinez dynamiquement leurs attributs
      products.forEach((product) => {
        product.attributeSets.forEach((attributeSet) => {
          attributeSet.forEach((attribute) => {
            // Ajoutez la clé de l'attribut à l'ensemble unique
            uniqueSubAttributes.add(attribute.name);
          });
        });
      });

      // Transformez l'ensemble en un tableau si nécessaire
      const subAttributesArray = Array.from(uniqueSubAttributes);

      // Répondez avec les sous-attributs
      res.json(subAttributesArray);
    } else {
      res.status(404).json({ error: 'Aucun produit trouvé pour cette catégorie.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des attributs.' });
  }
}


  
// export function getProductsByVendorAndStatus(req, res) {
//   const vendorId = req.params.vendorId;
//   const limit = Number(req.query.limit) || 0;
//   const sort = req.query.sort === 'desc' ? -1 : 1;
//   const status = 'En stock';

//   Products.find({
//     ownedBy: vendorId,
//     status: status,
//   })
//     .limit(limit)
//     .sort({ id: sort })
//     .then((products) => {
//       res.json(products);
//     })
//     .catch((err) => console.log(err));
// }

export function getProductsByVendorAndStatus(req, res) {
  const vendorId = req.params.vendorId;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort === 'desc' ? -1 : 1;

  Products.aggregate([
    {
      $match: {
        ownedBy:new mongoose.Types.ObjectId(vendorId),
      },
    },
    {
      $unwind: "$attributeSets",
    },
    {
      $match: {
        "attributeSets.name": "stock",
        "attributeSets.value": { $gt: 0 },
      },
    },
  ])
    .then((products) => {
      // Traitez les produits récupérés
      console.log(products);
      res.status(200).json(products);
    })
    .catch((err) => {
      // Gérez les erreurs
      console.error(err);
      res.status(500).json({ error: err.message });
    });
}






// export function addOnceProduct(req, res) {
//   const attributes = JSON.parse(req.body.attributeSets); // Parsez la chaîne JSON ici
//   // const attributes = req.body.attributeSets;

//   console.log(attributes);

//   // Validez les données reçues
//   if (!attributes || !Array.isArray(attributes)) {
//     return res.status(400).json({ error: 'Invalid attributeSets data' });
//   }

//   // Créez un tableau pour stocker les ensembles d'attributs
//   const attributeSets = [];
//   let currentSet = [];
//   attributes.forEach((attribute) => {
//     const { name, value } = attribute;

//     // Si la clé est "stock", commencez un nouvel ensemble d'attributs
//     if (name === 'stock') {
//       if (currentSet.length > 0) {
//         currentSet.push({ name: name, value: Number(value) || 0 });
//       }
//       currentSet = [];
//     }

//     // Ajoutez l'attribut à l'ensemble d'attributs actuel
//     currentSet.push({ name: name, value: value });
//   });

//   // Assurez-vous d'ajouter le dernier ensemble d'attributs
//   if (currentSet.length > 0) {
//     attributeSets.push(currentSet);
//   }

//   const productData = {
//     name: req.body.name,
//     price: req.body.price,
//     quantity: req.body.quantity,
//     category: req.body.category,
//     description: req.body.description,
//     status: req.body.status,
//     ownedBy: req.params.vendorId,
//     image: `${req.file.filename}`,
//     attributeSets: attributeSets,
//   };

//   Products.create(productData)
//     .then((newProduct) => {
//       console.log('Nouveau produit avec ensembles d\'attributs :');
//       console.log(newProduct);
//       res.status(200).json(newProduct);

