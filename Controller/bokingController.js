import mongoose from "mongoose";
import bookTable from "../Modal/BookTable.js";
import { mailTableFunction } from "../utils/nodeMailerConfig.js";

export const bookingHandler =  async (req, res) => {
  try {
    const { userId, date, time, preferance } = req.body;

    const existingReservation = await bookTable.findOne({ date, time });

    if (existingReservation) {
      return res.status(400).json({ message: 'Reservation already exists for this date and time.' });
    }

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ message: 'Reservations are only allowed on working days.' });
    }

    const parsedTime = parseInt(time.split(':')[0], 10);
    if (parsedTime < 8 || parsedTime >= 20) {
      return res.status(400).json({ message: 'Reservations are only allowed between 8 AM and 8 PM.' });
    }

    const newReservation = new bookTable({
      userId,
      date,
      time,
      preferences : preferance,
    });
 
    await newReservation.save();

    return res.status(201).json({ message: 'Reservation saved successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSpecificUserAllBookingsHandler = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const bookings = await bookTable.find({ userId })
        .sort({ timestamp: -1 }) .exec();
    
        return res.status(200).json({ message : "All booking of the specific User", data : bookings });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  };
  

  export const getAllBookingsHandler = async (req, res) => {
    try { 
        const bookings = await bookTable.find({  })
        .sort({ timestamp: -1 }) .exec();
    
        return res.status(200).json({ message : "All booking", data : bookings });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  };
  
  

export const cancelBookingHandler = async (req, res) => {
    try {
      
      const { reservationId, reservationDate, reservationTime } = req.body;
  
      const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
  
      const currentTime = new Date();
  
      const timeDifference = reservationDateTime - currentTime;
  
      if (timeDifference >= 60 * 60 * 1000) {
        const canceledReservation = await bookTable.findByIdAndDelete(reservationId);
  
        if (!canceledReservation) {
          return res.status(404).json({ message: 'Reservation not found.' });
        }
  
        return res.status(200).json({ message: 'Reservation canceled successfully.' });
      } else {
        return res.status(403).json({ message: 'Reservation cannot be canceled due to time constraints.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  export const updateTableHandler = async (req, res) => {
    try {
      const reservationId = req.params.reservationId; 
      const {tableNumber} = req.body;
      const updatedOrder = await bookTable.findByIdAndUpdate({_id : new mongoose.Types.ObjectId(reservationId)}, 
      {tableNumber : tableNumber});

      const emailInfo = await mailTableFunction(updatedOrder);

      console.log(emailInfo);

      return res.status(200).json({ message: 'Order Status updated successfully.', data : updatedOrder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  


