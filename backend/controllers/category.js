import Category from '../models/category.js';




export  function addOnceCategory (req, res){
            Category.create({
            name: req.body.name,

          })
            .then((newCategory) => {
              
              res.status(200).json({
                name: newCategory.name,

              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        }
      
  


export function getAll(req, res) {
  Category
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteCategory(req, res) {
  const id =req.params.id
  const products = await Category.findByIdAndDelete(id);
  res.status(200).json({"message":" Category deleted"});
}

export function getCategoryById(req, res){
  Category.findById(req.params.id)
          .then((doc) => {
            res.status(200).json(doc);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


export function putOnce(req, res) {
  let newCategory = {};
    if(req.file == undefined) {
      newCategory = {
        name: req.body.name,
        // products: req.body.products,
      }
    }
    else {
      newCategory = {
        name: req.body.name,
        // products: req.body.products,
      }
    }
  Category.findByIdAndUpdate(req.params.id, newCategory)
    .then((doc1) => {
      Category.findById(req.params.id)
        .then((doc2) => {
            res.status(200).json(doc2);
              })
        .catch((err) => {
            res.status(500).json({ error: err });
              });
          })
      .catch((err) => {
            res.status(500).json({ error: err });
          });
      }


