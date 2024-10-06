import React, { useState } from "react";
import { Row, Col, Button, Modal, Card } from "antd";
import "./BlogSection.css";

const blogData = [
  {
    title: "Top 5 Car Wash Tips",
    description: "Learn the best tips to keep your car shining year-round.",
    image: "https://i.ibb.co.com/WpzxDsK/blog1.jpg",
    date: "October 2, 2024",
    fullContent: `
      Keeping your car clean isn't just about looks—it's about maintenance. 
      Here are the top 5 tips for keeping your car in pristine condition:
      1. **Use the right cleaning products**: Always opt for car-specific shampoos and wax.
      2. **Rinse before scrubbing**: Make sure to rinse your car before applying soap to avoid scratching the paint.
      3. **Don't forget the wheels**: Use a dedicated wheel cleaner and brush for those hard-to-reach spots.
      4. **Dry with microfiber towels**: Avoid water spots by using soft microfiber towels to dry your car.
      5. **Wax regularly**: Applying wax protects your car’s paint and adds a shiny finish.
      Regular washing will help prevent rust, improve visibility, and maintain the resale value of your car.`,
  },
  {
    title: "How to Choose the Right Car Wash",
    description: "Not sure which service to pick? We've got you.",
    image: "https://i.ibb.co.com/B6kK5LQ/blog2.jpg",
    date: "September 20, 2024",
    fullContent: `
      Choosing the right car wash service depends on several factors:
      1. **Service Options**: Some services offer just a basic wash, while others include waxing, detailing, or engine cleaning.
      2. **Quality of Work**: Check reviews or ask for recommendations to find out how thorough a car wash service is.
      3. **Price vs Value**: Compare the prices and see if they are worth the quality and services offered.
      4. **Convenience**: Consider the location, working hours, and whether the car wash offers pickup/delivery options.
      5. **Eco-friendliness**: Many car washes use water-saving techniques and biodegradable cleaning products—something to consider if you’re environmentally conscious.
      By considering these points, you'll find the best car wash that fits your needs.`,
  },
  {
    title: "Why Regular Car Washing is Important",
    description: "Discover the benefits of washing your car regularly.",
    image: "https://i.ibb.co.com/2NK7CLr/blog3.jpg",
    date: "August 18, 2024",
    fullContent: `
      Washing your car regularly has several benefits:
      1. **Protects the Paint**: Dirt, bird droppings, and other contaminants can damage your car's paint over time.
      2. **Improves Safety**: Keeping windows, mirrors, and lights clean improves your visibility on the road.
      3. **Maintains Value**: Regularly cleaning your car prevents long-term damage, helping retain its value.
      4. **Prevents Rust**: Washing off salt and grime can prevent rust from developing on your car.
      5. **Enhances Aesthetics**: Keeping your car clean makes it look new, which can be a source of pride for many owners.
      Make it a habit to wash your car every 2 weeks or after heavy rains or snow.`,
  },
];

const BlogSection: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showModal = (blog: any) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="blog-section">
      <h2 className="section-title">Latest Blogs</h2>
      <Row gutter={[16, 16]}>
        {blogData.map((blog, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <img alt={blog.title} src={blog.image} className="card-image" />
              }
              className="blog-card"
            >
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-description">{blog.description}</p>
              <p className="blog-date">{blog.date}</p>
              <Button
                type="primary"
                onClick={() => showModal(blog)}
                className="read-more-btn"
              >
                Read More
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedBlog && (
        <Modal
          title={selectedBlog.title}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          className="blog-modal"
        >
          <div className="modal-content">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="modal-image"
            />
            <p className="modal-date">{selectedBlog.date}</p>
            <div
              className="modal-text"
              dangerouslySetInnerHTML={{ __html: selectedBlog.fullContent }}
            ></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BlogSection;
