import axios from "axios"
import { PRODUCT_DELETE_SUCCESS,PRODUCT_DELETE_REQUEST,PRODUCT_DELETE_FAIL, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_FAIL, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_REQUEST, PRODUCT_CREATE_REVIEW_FAIL, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_TOP_REQUEST, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAIL } from "../constants/productConstants"

export const listProducts = (keyword = '',pageNumber = '') => async(dispatch) => {
    try {
        dispatch({
            type:PRODUCT_LIST_REQUEST
        })

        const {data} = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)
        dispatch({
            type:PRODUCT_LIST_SUCCESS,
            payload:data
        })
    } catch (error) {
        dispatch({
            type:PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}

export const listProductDetails = (id) => async(dispatch) => {
    try {
        dispatch({
            type:PRODUCT_DETAILS_REQUEST
        })

        const {data} = await axios.get(`/api/products/${id}`)
        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data
        })
    } catch (error) {
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}


export const deleteProduct = (id) => async(dispatch, getState) =>{           //action for update order paid
    try {
        dispatch({
            type : PRODUCT_DELETE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()
        const config = {           //for token
            headers: {
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        await axios.delete(`/api/products/${id}`,config)      //get order 
        dispatch({
            type : PRODUCT_DELETE_SUCCESS,
        })



    } catch (error) {
        dispatch({
            type : PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}

export const createProduct = () => async(dispatch, getState) =>{           //action for update order paid
    try {
        dispatch({
            type : PRODUCT_CREATE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()
        const config = {           //for token
            headers: {
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.post('/api/products',{},config)      //get order 
        dispatch({
            type : PRODUCT_CREATE_SUCCESS,
            payload:data
        })



    } catch (error) {
        dispatch({
            type : PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}


export const updateProduct = (product) => async(dispatch, getState) =>{           //action for update order paid
    try {
        dispatch({
            type : PRODUCT_UPDATE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()
        const config = {           //for token
            headers: {
                'Content-Type':'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.put(`/api/products/${product._id}`,product,config)      //get order 
        dispatch({
            type : PRODUCT_UPDATE_SUCCESS,
            payload:data
        })



    } catch (error) {
        dispatch({
            type : PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}


export const createProductReview = (productId,review) => async(dispatch, getState) =>{           //action for create review
    try {
        dispatch({
            type : PRODUCT_CREATE_REVIEW_REQUEST
        })

        const {userLogin:{userInfo}} = getState()
        const config = {           //for token
            headers: {
                'Content-Type':'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        await axios.post(`/api/products/${productId}/reviews`,review,config)      //post review
        dispatch({
            type : PRODUCT_CREATE_REVIEW_SUCCESS
        })



    } catch (error) {
        dispatch({
            type : PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}


export const listTopProducts = () => async(dispatch) => {
    try {
        dispatch({
            type:PRODUCT_TOP_REQUEST
        })

        const {data} = await axios.get('/api/products/top')
        dispatch({
            type:PRODUCT_TOP_SUCCESS,
            payload:data
        })
    } catch (error) {
        dispatch({
            type:PRODUCT_TOP_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message  //if we have speicfic error pass that otherwise pass general error
        })
    }
}