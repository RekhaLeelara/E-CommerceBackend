const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    attributes: ['tag_name', 'id'],
    include:[
      {      
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['tag_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({message: 'No tag found with this id'});
        return;
      }
      res.json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

  // create a new tag
router.post('/', async(req, res) => {
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

  // Update a tag
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
      .then(dbTagData => {
        if (!dbTagData[0]) {
          res.status(404).json({ message: 'No tag found with this id' });
          return;
        }
        res.json(dbTagData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

  // delete on tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({ message: 'No tag found with this id' });
        return;
      }
      res.json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
