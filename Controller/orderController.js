import mongoose from "mongoose";
import order from "../Modal/Order.js";
import { mailerOrderInfoFunction } from "../utils/nodeMailerConfig.js";

export const   addOrderHandler = async (req, res)=> {
  try {
    const {
      userId,
      date,
      time,
      totalPrize,
      foodDescription,
      email,
      phone,
      address,
    } = req.body;

    const newOrder = new order({
      userId,
      date,
      time,
      totalPrize,
      foodDescription,
      email,
      phone,
      address,
    });

    await newOrder.save();

    return res.status(201).json({ message: 'Order added successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export const deleteOrderHandler =  async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      const order = await order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }
      if (order.orderStatus === 'not_started' || order.orderStatus === 'preparing') {
        await order.findByIdAndDelete(orderId);
        return res.status(200).json({ message: 'Order deleted successfully.' });
      } else {
        return res.status(403).json({ message: 'Order cannot be deleted due to its status.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getSpecificUserAllOrderHandler = async (req,res)=>{
    try {
        const userId = req.params.userId; 
        const orders = await order.findById({ _id : new mongoose.ObjextId(userId) })
        .sort({ timestamp: -1 }) .exec();
    
        return res.status(200).json({ message : "All orders of the specified users" , data : orders });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  }

  export const getAllOrderHandler = async (req,res)=>{
    try {
        const orders = await order.find({})
        .sort({ timestamp: -1 }).exec();
        console.log(orders);
    
        return res.status(200).json({ message : "All orders" , data : orders });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  }

  export const updateOrderStatusHandler = async (req, res) => {
    try {
      const orderId = req.params.orderId; 
      const {orderStatus} = req.body;
      const updatedOrder = await order.findByIdAndUpdate({_id : new mongoose.Types.ObjectId(orderId)}, 
      {$set : {orderStatus : orderStatus}});

      return res.status(200).json({ message: 'Order Status updated successfully.', data : updatedOrder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const deliveryInfoHandler = async (req, res) => {
    try {
      const orderId = req.params.orderId; 
      const {name,number} = req.body;
      const updatedOrder = await order.findByIdAndUpdate({_id : new mongoose.Types.ObjectId(orderId)}, 
      {$set : {deliveryInfo : {
        name : name,
        number : number
      }}});
  
      return res.status(200).json({ message: 'Delivery Info updated successfully.', data : updatedOrder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const emailHandler = async (req, res) => {
    try {
      const orderId = req.params.orderId; 

      const orderDetail = await order.findById({_id : new mongoose.Types.ObjectId(orderId)});

      const emailInfo = await mailerOrderInfoFunction(orderDetail.email,orderDetail.deliveryInfo,orderDetail.foodDescription,orderDetail.totalPrize);
      console.log(emailInfo);
      return res.status(200).json({ message: 'sent confirmation email successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
