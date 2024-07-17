import { Link } from "react-router-dom";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { Carousel } from "react-bootstrap";
import Loader from "./Loader";
import {Image} from "react-bootstrap";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <div className="carousel-image-wrapper">
              <Image src={product.image} alt={product.name} fluid />
            </div>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
