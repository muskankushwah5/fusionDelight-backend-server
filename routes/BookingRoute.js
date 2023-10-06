import express from "express";
import { bookingHandler, cancelBookingHandler, getAllBookingsHandler, getSpecificUserAllBookingsHandler, updateTableHandler } from "../Controller/bokingController.js";

const router = express.Router();

router.post("/add-booking",bookingHandler);

router.get("/get-booking",getAllBookingsHandler);
router.get("/specific-booking/:userId",getSpecificUserAllBookingsHandler);

router.post("/delete-booking",cancelBookingHandler);

router.put("/update-table/:reservationId",updateTableHandler);


export default router;