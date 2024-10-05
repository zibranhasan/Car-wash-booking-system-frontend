import React from "react";
import { motion } from "framer-motion";
import "./AboutUs.css"; // Ensure correct CSS import

const AboutUs: React.FC = () => {
  return (
    <div className="container">
      <div className="textSection">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to the Car Wash Booking System, your go-to platform for
          convenient and reliable car wash services. We understand how important
          it is to keep your vehicle clean and well-maintained, and we're here
          to make that process hassle-free. Our mission is to provide a seamless
          booking experience, ensuring that you can schedule your car wash with
          ease while receiving top-quality service. Whether you're looking for a
          quick wash or a detailed cleaning, we've got you covered. Let us take
          care of your car so you can enjoy a fresh, spotless ride every time.
        </motion.p>
      </div>
      <div className="imageSection">
        <motion.div
          className="imageContainer"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="overlayImageContainer"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://i.ibb.co/7zBk767/istockphoto-1346944001-612x612.jpg" // Replace with your image URL
              alt="About Us"
              className="overlayImage"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
