// src/components/ui/HeroSection.js
import { Carousel } from "antd";
import "./HeroSection.css"; // For additional styling if needed
import carWashImage1 from "../../assets/images/beautiful-car-washing-service.jpg";
import carWashImage2 from "../../assets/images/professional-washer-blue-uniform-washing-luxury-car-with-water-gun-open-air-car-wash.jpg";
import carWashImage3 from "../../assets/images/young-man-fashion-clothes-wiping-his-car-with-rug-after-washing-car-wash-station-man-wearing-white-t-shirt-jeans.jpg";
import CTAButton from "./CTAButton";

const HeroSection = () => {
  const carouselContent = [
    {
      key: "1",
      image: carWashImage1, // Replace with your image URLs
      heading: "Premium Car Wash Service",
      description:
        "Experience the ultimate car care with our premium wash packages.",
    },
    {
      key: "2",
      image: carWashImage2,
      heading: "Eco-Friendly Products",
      description:
        "We use environmentally safe products for a cleaner, greener wash.",
    },
    {
      key: "3",
      image: carWashImage3,
      heading: "Fast & Convenient",
      description:
        "Get your car sparkling clean in no time with our quick service.",
    },
  ];

  return (
    <div className="hero-section">
      <Carousel autoplay>
        {carouselContent.map((slide) => (
          <div key={slide.key} className="carousel-slide">
            <div
              className="carousel-image"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "400px", // Adjust the height as needed
              }}
            >
              <div className="carousel-content">
                <h1>{slide.heading}</h1>
                <p>{slide.description}</p>
                <CTAButton label="Book Now" targetPath="/services" />
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSection;
