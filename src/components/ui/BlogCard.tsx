// BlogCard.tsx
import React from "react";
import { Card } from "antd";
import { motion } from "framer-motion";
import "./BlogSection.css";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  image,
  date,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="blog-card"
    >
      <Card
        hoverable
        cover={
          <img
            src={image}
            alt={title}
            className="blog-image"
            style={{ height: "200px", objectFit: "cover", width: "100%" }}
          />
        }
        className="blog-card-content"
      >
        <Card.Meta title={title} description={description} />
        <div className="blog-date">{date}</div>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
