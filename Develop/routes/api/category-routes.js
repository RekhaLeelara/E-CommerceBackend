const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    attributes: ['category_name'],
    include:[
      {      
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find a single product by its `id`
  Category.findOne({
    attributes: ['category_name'],
    include:[
      {      
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({message: 'No category found with this id'});
        return;
      }
      res.json(dbCategoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create new category
router.post('/', async(req, res) => {
  try {
    const locationData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(locationData);
  } catch (err) {
    res.status(400).json(err);
  }
});


// update category
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
      .then(dbCategoryData => {
        if (!dbCategoryData[0]) {
          res.status(404).json({ message: 'No category found with this id' });
          return;
        }
        res.json(dbCategoryData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
