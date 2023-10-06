import express from "express";
import { addOrderHandler, deleteOrderHandler, deliveryInfoHandler, emailHandler, getAllOrderHandler, getSpecificUserAllOrderHandler, updateOrderStatusHandler } from "../Controller/orderController.js";

const router = express.Router();

router.post("/add-order",addOrderHandler);

router.delete("/delete-order/:orderId",deleteOrderHandler);

router.get("/specific-user-order/:userId",getSpecificUserAllOrderHandler);
router.get("/all-orders",getAllOrderHandler);

router.put("/update-status/:orderId",updateOrderStatusHandler);
router.put("/update-delivery-info/:orderId",deliveryInfoHandler);
router.put("/send-confirmation-email/:orderId",emailHandler);

export default router;