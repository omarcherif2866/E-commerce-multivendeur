
import Commandes from '../models/commande.js';
import Products from '../models/product.js';
import Orders from '../models/order.js';

async function getStockAttribute(attributeList, targetAttributeSet) {
  try {
    console.log('Checking attributeList:', attributeList);
    console.log('Checking targetAttributeSet:', targetAttributeSet);

    if (!targetAttributeSet) {
      console.error('TargetAttributeSet is undefined');
      return { error: 'TargetAttributeSet is undefined' };
    }

    // Aplatir la liste des attributs
    const flatAttributeList = attributeList.flat();
    console.log('Flat attributeList:', flatAttributeList);

    const targetAttribute = flatAttributeList.find(attribute => attribute._id && attribute._id.toString() === targetAttributeSet._id.toString());

    console.log('TargetAttributeSet after toString:', targetAttributeSet.toString());
    console.log('Found attribute:', targetAttribute);

    if (!targetAttribute) {
      console.log('Target Attribute Set not found. Returning default stock attribute.');
      console.log('TargetAttributeSet:', targetAttributeSet);
      console.log('AttributeList:', flatAttributeList);
      return { stockAttribute: { name: 'stock', value: 0 } };
    }

    console.log('Found attributeSet:', targetAttributeSet);
    return { stockAttribute: targetAttribute };
  } catch (error) {
    console.error('Error in getStockAttribute:', error);
    return { error: 'Error in getStockAttribute' };
  }
}



export async function createCommande(req, res) {
  try {
    console.log('Avant la création de la commande');

    const { items } = req.body;
    const clientId = req.params.clientId;

    if (!items || !clientId) {
      return res.status(400).json({ message: 'Les données requises sont manquantes dans le corps de la requête.' });
    }

    const ordersBySeller = {};

    const orderItems = [];

    for (const item of items) {
      console.log('Processing item:', item);

      console.log('Checking attributeSet:', item.attributeSet);

      const productId = item.productId;

      const product = await getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: `Le produit avec l'ID ${productId} n'a pas été trouvé.` });
      }

      const stockAttributeResult = await getStockAttribute(product.attributeSets, item.attributes && item.attributes[0]);

      if (stockAttributeResult.error) {
        console.error(stockAttributeResult.error);
        return res.status(500).json({ message: 'Erreur lors de la création de la commande' });
      }

      const { stockAttribute } = stockAttributeResult;

      const quantity = item.quantity;
      console.log(`Checking stockAttribute: ${JSON.stringify(stockAttribute)}`);

      if (stockAttribute.value < quantity) {
        console.log(`Stock insuffisant pour le produit avec l'ID ${productId}. Stock actuel: ${stockAttribute.value}, Quantité demandée: ${quantity}`);
        return res.status(400).json({ message: `Stock insuffisant pour le produit avec l'ID ${productId}` });
      }

      // Mise à jour du stock correct
      const newStockValue = stockAttribute.value - quantity;
      stockAttribute.value = newStockValue;

      // Sauvegarde du produit avec le stock mis à jour
      await product.save();

      orderItems.push({
        productId,
        quantity,
        stockAttribute,
      });

      const ownedBy = product.ownedBy;

      ordersBySeller[ownedBy] = ordersBySeller[ownedBy] || {
        userId: ownedBy,
        items: [],
        total: 0,
      };

      ordersBySeller[ownedBy].items.push({
        productId: productId,
        quantity: quantity,
        statusOrder: item.statusOrder,
        stockAttribute: stockAttribute,
      });

      ordersBySeller[ownedBy].total += quantity;
    }

    const orderPromises = Object.values(ordersBySeller).map(async (orderData) => {
      const isTerminated = orderData.items.some((item) => item.statusOrder === 'Terminé');
      const createdOrder = await Orders.create({
        clientId: clientId,
        items: orderData.items,
        total: orderData.total,
        statusOrder: isTerminated ? 'Terminé' : 'En Cours',
      });
      return createdOrder;
    });

    const createdOrders = await Promise.all(orderPromises);
    const statusOrders = createdOrders.map((order) => order.statusOrder);

    let statusCommande = 'Terminé';

    if (statusOrders.includes('En Cours')) {
      statusCommande = 'Commande En Cours';
    }

    const globalOrder = {
      clientId: clientId,
      items: items,
      total: items.reduce((total, item) => total + item.quantity, 0),
      orders: createdOrders,
      statusCommande: statusCommande,
    };

    const createdGlobalOrder = await Commandes.create(globalOrder);
    const globalOrderId = createdGlobalOrder._id;

    for (const order of createdOrders) {
      order.commandeId = globalOrderId;
      await order.save();
    }

    // Mise à jour des stocks après avoir créé la commande et les ordres

    res.status(200).json({ globalOrder: createdGlobalOrder });
    console.log(createdGlobalOrder);
    console.log('Après la création de la commande');
  } catch (error) {
    console.error('Erreur lors de la création de la commande', error);
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
}





export async function getProductById(productId) {
  try {
    const product = await Products.findById(productId).exec();

    if (!product || !product._id) {
      console.error(`Le produit avec l'ID ${productId} n'a pas été trouvé ou n'a pas de propriété '_id'.`);
      return null;
    }

    return product; // Retournez directement le modèle Mongoose
  } catch (error) {
    console.error('Erreur lors de la récupération du produit par ID:', error);
    return null;
  }
}







export async function getCommandeById(req, res) {
  try {
    // Récupérez l'ID de la commande à partir des paramètres de l'URL
    const commandeId = req.params.commandeId;

    // Recherchez la commande dans la base de données en utilisant findById
    const commande = await Commandes.findById(commandeId).exec();

    // Si la commande n'est pas trouvée, renvoyez un message d'erreur
    if (!commande) {
      return res.status(404).json({ message: "La commande spécifiée n'a pas été trouvée." });
    }

    // Renvoyez la commande trouvée en réponse
    res.status(200).json({ commande: commande });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande par ID', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de la commande par ID' });
  }
}



// export async function getOrdersByCommande(req, res) {
//   try {
//     // Récupérez l'ID de la commande à partir des paramètres de l'URL
//     const commandeId = req.params.commandeId;

//     // Recherchez la commande dans la base de données
//     const commande = await Commandes.findById(commandeId).exec();

//     // Si la commande n'est pas trouvée, renvoyez un message d'erreur
//     if (!commande) {
//       return res.status(404).json({ message: "La commande spécifiée n'a pas été trouvée." });
//     }

//     // Renvoyez les orders associés en réponse
//     res.status(200).json({ orders: commande.orders });
//   } catch (error) {
//     console.error('Erreur lors de la récupération des orders par commande', error);
//     return res.status(500).json({ message: 'Erreur lors de la récupération des orders par commande' });
//   }
// }

export function getAllCommande(req, res) {
              // console.log(req.params.vendorId)
            
              Commandes
                .find({})
            
                .then(docs => {
                  // console.log(req.params.vendorId)
                  res.status(200).json(docs);
                })
                .catch(err => {
                  res.status(500).json({ error: err });
                });
            }