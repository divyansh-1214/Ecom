import axios from "axios";
//addToCart fuction is used to add the rpoduct to the cart of the user and if the cart is not present then it will create the cart and add the product to it
export const addToCart = async (data) => {
  console.log(data);
  try {
    const response = await axios.post('http://localhost:3000/cart/add', {
      userId: data.userId,
      productId: data.productId,
      selectedSize:data.selectedSize,
      selectedColor:data.selectedColor,
      quantity: data.quantity,
      price:data.price,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCart = async (userId) => {
  console.log(userId);
  try {
    const response = await axios.get(`http://localhost:3000/cart/get/${userId}`, {
      params: {
        userId: userId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const response = await axios.delete(`http://localhost:3000/cart/remove/${userId}`, {
      params: {
        userId: userId,
        productId: productId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};
