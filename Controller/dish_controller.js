import dish from "../Modal/Dish.js";

export const addDishHandler = async (req, res) =>{
  try {
    const {
      title,
      description,
      prize,
      cuisine_type,
      dish_type,
      choices,
      dishUrl,
    } = req.body;

    const newDish = new dish({
      title,
      description,
      prize,
      cuisine_type,
      dish_type,
      choices,
      dishUrl,
    });

    await newDish.save();

    return res.status(201).json({ message: 'Dish added successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const deleteDishHandler = async (req, res) => {
    try {
      const dishId = req.params.dishId; 

      const deletedDish = await dish.findByIdAndDelete(dishId);
  
      if (!deletedDish) {
        return res.status(404).json({ message: 'Dish not found.' });
      }
  
      return res.status(200).json({ message: 'Dish deleted successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const updateDishHandler = async (req, res) => {
    try {
      const dishId = req.params.dishId;
      const updatedDishData = req.body;   
      const updatedDish = await dish.findByIdAndUpdate(dishId, updatedDishData, { new: true });
  
      if (!updatedDish) {
        return res.status(404).json({ message: 'Dish not found.' });
      }
  
      return res.status(200).json({ message: 'Dish updated successfully.', data : updatedDish });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
   

  export const getAllDishHandler = async (req, res) => {
    try {
      // Retrieve all dishes
      const dishes = await dish.find({})
        .sort({ timestamp: -1 })
        .exec();
  
        const baseUrl = 'https://fusion-delight-backend-server.vercel.app';
      // Construct image URLs for each dish
      const dishesWithImageUrls = dishes.map((dish) => {
        const imageUrl = `${baseUrl}/uploads/${dish.dishUrl}`; // Construct the image URL
        return {
          _id: dish._id,
          title: dish.title,
          description: dish.description,
          prize: dish.prize,
          cuisine_type: dish.cuisine_type,
          dish_type: dish.dish_type,
          choices: dish.choices,
          dishUrl: imageUrl, // Include the image URL
          createdAt: dish.createdAt,
        };
      });
  
      return res.status(200).json({ message: 'All Dishes', data: dishesWithImageUrls });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
   

  export const getSpecificTypeDishHandler = async (req, res) => {
    try {
      // Retrieve all dishes
      const cuisine_type = req.query.cuisine_type;
      const dish_type = req.query.dish_type;
      const dishes = await dish.find({dish_type : type,cuisine_type : cuisine_type})
        .sort({ timestamp: -1 })
        .exec();
  
        const baseUrl = 'https://fusion-delight-backend-server.vercel.app';
      // Construct image URLs for each dish
      const dishesWithImageUrls = dishes.map((dish) => {
        const imageUrl = `${baseUrl}/uploads/${dish.dishUrl}`; // Construct the image URL
        return {
          _id: dish._id,
          title: dish.title,
          description: dish.description,
          prize: dish.prize,
          cuisine_type: dish.cuisine_type,
          dish_type: dish.dish_type,
          choices: dish.choices,
          dishUrl: imageUrl, // Include the image URL
          createdAt: dish.createdAt,
        };
      });
  
      return res.status(200).json({ message: 'All Dishes', data: dishesWithImageUrls });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  
  export const getSpecificCuisineTypeDishHandler = async (req, res) => {
    try {
      // Retrieve all dishes
      const type = req.params.type;
      const dishes = await dish.find({cuisine_type : type})
        .sort({ timestamp: -1 })
        .exec();
  
        const baseUrl = 'https://fusion-delight-backend-server.vercel.app';
      // Construct image URLs for each dish
      const dishesWithImageUrls = dishes.map((dish) => {
        const imageUrl = `${baseUrl}/uploads/${dish.dishUrl}`; // Construct the image URL
        return {
          _id: dish._id,
          title: dish.title,
          description: dish.description,
          prize: dish.prize,
          cuisine_type: dish.cuisine_type,
          dish_type: dish.dish_type,
          choices: dish.choices,
          dishUrl: imageUrl, // Include the image URL
          createdAt: dish.createdAt,
        };
      });
  
      return res.status(200).json({ message: 'All Dishes', data: dishesWithImageUrls });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
   
   
  
