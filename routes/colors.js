const express = require('express');
const router = express.Router();
const Colors = require('../models/Colors');


// POST 
router.post('/', async (req, res) => {
  try {
    // console.log('Request Body:', req.body); 
    const latestColor = await Colors.findOne().sort({ orderNumber: -1 });
    let orderNumber = 1;

    if (latestColor){
      orderNumber = latestColor.orderNumber + 1;
    } 
    req.body.orderNumber = orderNumber;
    const newColor = new Colors(req.body);
    const savedColor = await newColor.save();
    res.json(savedColor);
  } catch (error) {
    console.error('Error registering colors:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});


// GET all palettes
router.get('/', async(req, res) => {
  try {
    const colors = await Colors.find()
    res.json(colors);
    // console.log(colors);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
})


// GET My colors
router.get('/mycolors/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 
    const myColors = await Colors.find({ userId });
    res.json(myColors);
    // console.log(myColors);
  } catch (error) {
    console.error('Error fetching user colors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get My liked Colors
router.get('/my-liked-colors/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 
    const likedColors = await Colors.find({ likes: { $in: [userId] } });
        // console.log(likedColors);

    res.status(200).json(likedColors);
  } catch (err) {
    console.error("Error getting liked colors:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE 
router.delete('/:id', async (req, res) => {
  try {
    const color = await Colors.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ error: 'Color not found or you do not have permission to delete it' });
    }
    const orderNumberToDelete = color.orderNumber;
    await Colors.deleteOne({ _id: color });

    await Colors.updateMany(
      { orderNumber: { $gt: orderNumberToDelete } },
      { $inc: { orderNumber: -1 } }
    );
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error('Error deleting color:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// LIKE
router.put("/:id/like", async (req, res) => {
    try {
      const color = await Colors.findById(req.params.id);
      if (!color.likes.includes(req.body.userId)) {
        await color.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The color has been liked");
      } else {
        await color.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The color has been disliked");
      }
    } catch (err) {
      console.error("Error in the server route:", err);
      res.status(500).json(err);
    }
  });







module.exports = router;
