import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import Meta from "./Meta";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch, na } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    if (product.countInStock === 0) {
      toast.error("No stock available");
    } else {
      try {
        dispatch(addToCart({ ...product, qty: 1 })); // Add one product
        // navigate("/cart");
        toast.success(
          <>
            <div>
              <img src={product.image} alt={product.name} style={{ width: '50px', marginRight: '10px' }} />
              <span>Item "{product.name}" added to cart successfully</span>
            </div>
          </>
        );
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">₱{product.price}</Card.Text>
        <Button variant="secondary" size="sm" onClick={addToCartHandler}>
          Add to Cart {/*here is where i put ard to cart handler */}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
