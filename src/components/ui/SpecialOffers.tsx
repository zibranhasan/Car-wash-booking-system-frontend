// SpecialOffers.tsx
import React from "react";
import { Row, Col, Button } from "antd";
import { motion } from "framer-motion";
import "./SpecialOffers.css";
import { Link } from "react-router-dom";

const offers = [
  {
    title: "20% Off Full Car Wash",
    description:
      "Get 20% off our full car wash service. Offer valid until October 31st!",
    image: "/images/full-car-wash.jpg",
    discount: "20% Off",
  },
  {
    title: "Buy 2, Get 1 Free",
    description:
      "Book two car washes and get the third one free. Limited-time offer!",
    image: "/images/buy2-get1.jpg",
    discount: "Buy 2, Get 1",
  },
  {
    title: "Summer Special - Free",
    description:
      "Book a car wash this summer and get free waxing with your service.",

    discount: "Free Waxing",
  },
];

const SpecialOffers: React.FC = () => {
  return (
    <div className="special-offers-section">
      <Row gutter={[24, 24]}>
        {offers.map((offer, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="offer-card"
              style={{ backgroundImage: `url(${offer.image})` }}
            >
              <div className="offer-content">
                <div className="offer-discount">{offer.discount}</div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <Link to="/services">
                  <Button
                    style={{
                      backgroundColor: "#001529",
                      borderColor: "#001529",
                      color: "#fff",
                    }}
                  >
                    Get Offer
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SpecialOffers;
