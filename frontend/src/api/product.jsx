import axios from "axios";

 export const getProductAll = async () => {
    const response = await axios.get('http://localhost:3000/product/all');
    return response.data;
 }

 export const getProductById = async (id) => {
    const response = await axios.get(`http://localhost:3000/product/${id}`);
    return response.data;
 }

 export const updateProduct = async (id, data) => {
    const response = await axios.put(`http://localhost:3000/product/update/${id}`, data);
    return response.data;
 }

 export const deleteProduct = async (id) => {
    const response = await axios.delete(`http://localhost:3000/product/delete/${id}`);
    return response.data;
 }
