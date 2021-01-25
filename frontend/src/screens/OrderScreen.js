import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import {PayPalButton} from 'react-paypal-button-v2'
import { Row } from 'react-bootstrap'
import { ListGroup,Button } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deliverOrder, getOrderDetails,payOrder } from '../actions/orderActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useState } from 'react'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'

const OrderScreen = ({match,history}) => {
    const orderId = match.params.id
    const [sdkReady, setSdkReady] = useState(false)        //sdk- software development kit becomes true when script loads
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const {order,loading,error} = orderDetails
    
    const  userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay,success:successPay} = orderPay       //if order is paid or not

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading:loadingDeliver,success:successDeliver} = orderDeliver       //if order is Deliver or not

    if(!loading){
        // calculate prices
        const addDecimals = (num) => {
            return (Math.round(num*100)/100).toFixed(2);
        } 
        order.itemsPrice = addDecimals(order.orderItems.reduce( (acc,item) => acc + item.price * item.qty, 0))
    } 
    

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }
        const addPayPalScript = async() => {                  //adding paypal script to body dynamically
            const {data: clientId} = await axios.get('/api/config/paypal')            //fetching client id from backend
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if(!order ||successPay||successDeliver){    
            dispatch({type:ORDER_PAY_RESET})                //makeing state again empty for preventing the never ending loop
            dispatch({type:ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))         //if order is not there or payment is done in both cases we have to show orders page
        }
        else if(!order.isPaid){                     //if order is not paid
            if(!window.paypal){                   // if paypal script is not added
                addPayPalScript()
            }
            else{
                setSdkReady(true)
            }
        }

        
    },[dispatch,orderId,order,successPay,successDeliver,userInfo,history]) 


    const successPaymentHandler= (paymentResult)=> {
        console.log(paymentResult);
        dispatch(payOrder(orderId,paymentResult))            // to make the isPaid true
    }
   
    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading? <Loader/>: error ? <Message variant='danger'>{error}</Message> :
    <>
        <h1>Order {order._id}</h1>
        <Row>
             <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>  
                        <p>
                            <strong>Name:</strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email:</strong>{' '}
                            <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2> 
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2> 
                        {order.orderItems.length === 0? <Message>Your order is empty</Message> : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item,index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                    
                </ListGroup>
             </Col>

             <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader/>}
                                {!sdkReady ? <Loader/> : (
                                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}/>
                                )}
                            </ListGroup.Item>
                        )}
                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
             </Col>
         </Row>  
    </> 
}

export default OrderScreen
