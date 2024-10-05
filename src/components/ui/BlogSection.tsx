// BlogSection.tsx
import React from "react";

import { Row, Col } from "antd";
import BlogCard from "./BlogCard";
import "./BlogSection.css";

const blogData = [
  {
    title: "Top 5 Car Wash Tips",
    description: "Learn the best tips to keep your car shining.",
    image: "https://i.ibb.co.com/WpzxDsK/blog1.jpg",
    date: "October 2, 2024",
  },
  {
    title: "How to Choose the Right Car Wash Service",
    description: "Not sure which service to pick? We've got you",
    image: "https://i.ibb.co.com/B6kK5LQ/blog2.jpg",
    date: "September 20, 2024",
  },
  {
    title: "Why Regular Car Washing is Important",
    description: "Discover the benefits of washing your car regularly.",
    image: "https://i.ibb.co.com/2NK7CLr/blog3.jpg",
    date: "August 18, 2024",
  },
];

const BlogSection: React.FC = () => {
  return (
    <div className="blog-section">
      <h2 className="section-title">Latest Blogs</h2>
      <Row gutter={[16, 16]}>
        {blogData.map((blog, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <BlogCard
              title={blog.title}
              description={blog.description}
              image={blog.image}
              date={blog.date}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BlogSection;
