import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button,Row,Col,Form } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'
import { Table } from 'react-bootstrap'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = ({location,history}) => {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [message,setMessage] = useState(null)

 
    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)       //get user details
    const {loading, error, user} = userDetails

    const userLogin = useSelector(state => state.userLogin)       //to check to if user is logged in or not 
    const { userInfo } = userLogin 

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)       //to check to if profile is updated or not
    const { success } = userUpdateProfile 

    const orderListMy = useSelector(state => state.orderListMy)       // to get all orders of logged in user
    const {loading:loadingOrders, error:errorOrders, orders} = orderListMy

    useEffect( () => {   
        if(!userInfo){                         //if user is not logged in redirect to login page
            history.push('/login')
        }
        else{
            if(!user || !user.name ||success){    
                dispatch({
                    type:USER_UPDATE_PROFILE_RESET
                })               
                dispatch(getUserDetails('profile'))            // if user just come to profile page get user deatils 
                dispatch(listMyOrders())                         // action for getting orders
            }     
            else{                                               //if we have user
                setName(user.name)                             //user want to change details
                setEmail(user.email)
            }
        }
    },[dispatch,history,userInfo,user,success]) 

    const submitHandler = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setMessage('Password do not match')
        }
        else{
            dispatch(updateUserProfile({
                id:user._id,name,email,password
            }))                            // action to update user profile
        }
    }

    return <Row>
        <Col md={3}>
        <h2>User Profile</h2>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {success && <Message variant='success'>Profile Updated</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group> 
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group> 
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group> 
                <Form.Group controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary'>Upadate</Button>
            </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? <Loader/> : errorOrders ? <Message variant='danger'>{errorOrders}</Message>: (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? order.paidAt.substring(0,10) : <i className='fas fa-times' style={{color:'red'}}></i>}
                                </td>
                                <td>
                                    {order.isDelivered ? order.deliveredAt.substring(0,10) : <i className='fas fa-times' style={{color:'red'}}></i>}
                                </td>
                                <td>
                                    <LinkContainer to={`order/${order._id}`}>
                                        <Button className='btn-sm' variant='light'>Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Col>
    </Row>
}

export default ProfileScreen
