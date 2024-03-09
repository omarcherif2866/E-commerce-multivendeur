import Orders from '../models/order.js';
import Commandes from '../models/commande.js';



export async function DeleteOrder(req, res) {
  const id =req.params.id
  const order = await Orders.findByIdAndDelete(id);
  res.status(200).json({"message":"deleted"});
}

export function getOrderById(req, res){
  Orders.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }



export function putOnceOrder(req, res) {
  const orderId = req.params.id;
  const newStatusOrder = req.body.status;

  // Ajoutez une instruction console.log pour vérifier l'ID de l'ordre
  console.log('Order ID:', orderId);

  // Mettez à jour l'ordre individuel
  Orders.findByIdAndUpdate(orderId, { statusOrder: newStatusOrder }, { new: true })
    .then((updatedOrder) => {
      // Ajoutez une instruction console.log pour vérifier l'ordre mis à jour
      console.log('Updated Order:', updatedOrder);

      // Trouvez la commande globale à laquelle appartient cette commande individuelle
      Commandes.findOne({ orders: orderId })
        .populate('orders') // Assurez-vous que les sous-commandes (orders) sont bien populées
        .then((globalOrder) => {
          // Ajoutez une instruction console.log pour vérifier la commande globale
          console.log('Global Order:', globalOrder);

          // Vérifiez le statut de toutes les commandes individuelles de la commande globale
          const allOrdersCompleted = globalOrder.orders.every((order) => order.statusOrder === 'Terminé');
          const anyOrderInProgress = globalOrder.orders.some((order) => order.statusOrder === 'En Cours');

          // Ajoutez des instructions console.log pour vérifier les valeurs
          console.log('All Orders Completed:', allOrdersCompleted);
          console.log('Any Order In Progress:', anyOrderInProgress);

          // Mettez à jour le statut de la commande globale en conséquence
          if (allOrdersCompleted) {
            globalOrder.statusCommande = 'Terminé';
          } else if (anyOrderInProgress) {
            globalOrder.statusCommande = 'Commande En Cours';
          } else {
            // Si aucun ordre individuel n'est en cours et qu'aucun n'est terminé, vous pouvez définir un autre statut ici si nécessaire.
          }

          // Enregistrez la commande globale mise à jour
          globalOrder.save()
            .then(() => {
              res.status(200).json(updatedOrder);
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}


export function getAllOrders(req, res) {
              console.log(req.params.vendorId)
            
              Orders
                .find({})
            
                .then(docs => {
                  // console.log(req.params.vendorId)
                  res.status(200).json(docs);
                })
                .catch(err => {
                  res.status(500).json({ error: err });
                });
            }

export function getOrderByClient(req, res)  {
	const clientId = req.params.clientId;
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Orders.find({
		clientId,
	})
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((orders) => {
			res.json(orders);
		})
		.catch((err) => console.log(err));
};



export async function getOrdersByCommande(req, res) {
  try {
    // Récupérez l'ID de la commande à partir des paramètres de l'URL
    const commandeId = req.params.commandeId;

    // Recherchez la commande dans la base de données
    const commande = await Commandes.findById(commandeId).exec();

    // Si la commande n'est pas trouvée, renvoyez un message d'erreur
    if (!commande) {
      return res.status(404).json({ message: "La commande spécifiée n'a pas été trouvée." });
    }

    // Renvoyez les orders associés en réponse
    res.status(200).json({ orders: commande.orders });
  } catch (error) {
    console.error('Erreur lors de la récupération des orders par commande', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des orders par commande' });
  }
}

// export async function getOrdersByVendor(req, res) {
//   try {
//     const vendorId = req.params.vendorId;

//     // Recherchez toutes les commandes dont les produits sont liés au vendeur en utilisant son ID
//     const orders = await Orders.find({}).populate({
//       path: 'items.productId',
//       match: { ownedBy: vendorId },
//     }).exec();

//     const filteredOrders = orders.filter(order => order.items.length > 0);

//     res.status(200).json({ orders: filteredOrders });
//   } catch (error) {
//     console.error('Erreur lors de la récupération des commandes par vendeur', error);
//     return res.status(500).json({ message: error });
//   }
// }



export async function getOrdersByVendor(req, res) {
  try {
    const vendorId = req.params.vendorId;

    const orders = await Orders.find({}).populate({
      path: 'items.productId',
      select: '-attributeSets', // Exclure le champ attributeSets
      match: { ownedBy: vendorId },
    }).exec();

    const filteredOrders = orders.map(order => {
      const filteredItems = order.items.filter(item => item.productId !== null);
      if (filteredItems.length > 0) {
        return {
          ...order.toObject(),
          items: filteredItems,
        };
      }
      return null;
    }).filter(order => order !== null);

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes par vendeur', error);
    return res.status(500).json({ message: error });
  }
}







