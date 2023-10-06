import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from 'fs';

import path, { join } from "path";

import multer from "multer";

import userRoutes from "./routes/UserRoute.js";
import bookingRoute from "./routes/BookingRoute.js";
import dishRoutes from "./routes/DishRoute.js";
import orderRoutes from "./routes/OrderRoute.js";
import Connection from "./database/db.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dish from "./Modal/Dish.js";
import user from "./Modal/User.js";
import order from "./Modal/Order.js";
import bookTable from "./Modal/BookTable.js";




const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



dotenv.config();

const PORT = process.env.PORT || 8800;

const url = process.env.URL;

Connection(url);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${uniqueSuffix}.${fileExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/api/add-dish', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const choisesData = JSON.parse(req.body.choices);
  console.log(choisesData);

  // Create a new dish document with the dish data
  const newDish = new dish({
    title: req.body.title,
    description: req.body.description,
    cuisine_type: req.body.cuisine_type,
    dish_type: req.body.dish_type,
    prize: req.body.prize,
    choices: choisesData, // Assuming choices are comma-separated
    dishUrl: req.file.filename, // Store the image filename in the dish document
  });

  console.log(newDish);

  try {
    await newDish.save();
    res.json({ message: 'Dish and image uploaded successfully', data : newDish });
  } catch (error) {
    console.error('Error saving dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/update-dish/:id', upload.single('image'), async (req, res) => {
  const dishId = req.params.id;

  try {
    const existingDish = await dish.findById(dishId);

    if (!existingDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    const {
      title,
      description,
      cuisine_type,
      dish_type,
      choices,
      prize,
    } = req.body;

    if (req.file) {
      // If a new image is uploaded, delete the old image
      if (existingDish.dishUrl) {
        // Delete the old image from the 'uploads' folder
        // You may need to install and import the 'fs' module for this
        fs.unlinkSync(`uploads/${existingDish.dishUrl}`);
      }

      // Update the dish document with the new image filename
      existingDish.dishUrl = req.file.filename;
    }

    // Update other dish fields
    existingDish.title = title;
    existingDish.description = description;
    existingDish.cuisine_type = cuisine_type;
    existingDish.dish_type = dish_type;
    existingDish.choices = JSON.parse(choices); // Parse the choices JSON string
    existingDish.prize = prize;

    await existingDish.save();
    res.json({ message: 'Dish updated successfully', data: existingDish });
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/userCountsMonthly', async (req, res) => {
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // Month is zero-based

    const monthlyCounts = [];

    for (let month = 1; month <= thisMonth; month++) {
      const startDate = new Date(thisYear, month - 1, 1); // Month is zero-based
      const endDate = new Date(thisYear, month, 0);

      const count = await user.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      monthlyCounts.push({ month, count });
    }

    res.json(monthlyCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/api/reservationCountMonthly', async (req, res) => {
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // Month is zero-based

    const monthlyCounts = [];

    for (let month = 1; month <= thisMonth; month++) {
      const startDate = new Date(thisYear, month - 1, 1); // Month is zero-based
      const endDate = new Date(thisYear, month, 0);

      const count = await bookTable.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      monthlyCounts.push({ month, count });
    }

    res.json(monthlyCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/api/orderDataMonthly', async (req, res) => {
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // Month is zero-based

    const monthlyCounts = [];

    for (let month = 1; month <= thisMonth; month++) {
      const startDate = new Date(thisYear, month - 1, 1); // Month is zero-based
      const endDate = new Date(thisYear, month, 0);

      const count = await order.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      monthlyCounts.push({ month, count });
    }

    res.json(monthlyCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


app.get('/api/tableLengths', async (req, res) => {
  try {
    const userCount = await user.countDocuments();
    const orderCount = await order.countDocuments();
    const reservationCount = await bookTable.countDocuments();
    const dishCount = await dish.countDocuments();

    // Add more counts for other tables as needed

    const tableLengths = {
      users : userCount,
      orders : orderCount,
      reservations : reservationCount,
      dishes : dishCount
    };

    res.json(tableLengths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);

app.get("/get-session", (req, res) => {
  const user = req.session.user;
  res.json(user);
});
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoute);
app.use("/api/order", orderRoutes);
app.use("/api/dish", dishRoutes);
