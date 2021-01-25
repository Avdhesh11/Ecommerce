import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'


//@desc  - create new order
//@route  - post api/orders
//@access  - private
const addOrderItems = asyncHandler(async(req,res) => {
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shoppingPrice, totalPrice} = req.body

    if(orderItems && orderItems.length ===0 ){
        res.status(404)
        throw new Error('No order Items')
    }
    else{
        const order = new Order({
            user:req.user._id,
            orderItems,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shoppingPrice, 
            totalPrice
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

//@desc  - get order by id 
//@route  - get api/orders/:id
//@access  - private
const getOrderById = asyncHandler(async(req,res) => {
   const order = await Order.findById(req.params.id).populate('user','name email')       //populate is finding the user field in order Model and
                                                                                         // attach name email of from user model with given id
   if(order){
       res.json(order)
   }
   else{
       res.status(404)
       throw new Error('Order Not Fount')
   }
})

//@desc  - update order to paid
//@route  - get api/orders/:id/pay
//@access  - private
const updateOrderToPaid = asyncHandler(async(req,res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true,
        order.paidAt = Date.now()
        order.paymentResult = {
            id:req.body.id,
            status:req.body.status,
            update_time:req.body.update_time,
            email_address:req.body.email_address
        }

        const updatedOrder = await order.save() 
        res.json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error('Order Not Fount')
    }
 })

 //@desc  - update order to delivered
//@route  - get api/orders/:id/deliver
//@access  - private/Admin
const updateOrderToDelivered = asyncHandler(async(req,res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isDelivered = true,
        order.deliveredAt = Date.now()
       
        const updatedOrder = await order.save() 
        res.json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error('Order Not Fount')
    }
 })

 //@desc  - get logged in user orders
//@route  - get api/orders/myorders
//@access  - private
const getMyOrders = asyncHandler(async(req,res) => {
    const orders = await Order.find({user:req.user._id})
    res.json(orders)

 })

  //@desc  - get all orders
//@route  - get api/orders
//@access  - private/Admin
const getOrders = asyncHandler(async(req,res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)

 })
 

export {addOrderItems,getOrderById, updateOrderToPaid, getMyOrders,getOrders,updateOrderToDelivered}