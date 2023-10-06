import express from "express";
import { addDishHandler, deleteDishHandler, getAllDishHandler, getSpecificCuisineTypeDishHandler, getSpecificTypeDishHandler, updateDishHandler } from "../Controller/dish_controller.js";

const router = express.Router();

router.post("/add-dish",addDishHandler);

router.put("/update-dish/:dishId",updateDishHandler);

router.delete("/delete-dish/:dishId",deleteDishHandler);

router.get("/all-dishes",getAllDishHandler);

router.get("/specific-dishes",getSpecificTypeDishHandler);

router.get("/specific-cuisine/:type",getSpecificCuisineTypeDishHandler);

export default router;