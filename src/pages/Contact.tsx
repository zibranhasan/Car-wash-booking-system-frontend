import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const Contact = () => {
  return (
    <div className="bg-gray-100 min-h-screen text-black">
      {/* Hero Section */}
      <section className="hero bg-gray-100  text-white py-20 text-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold leading-tight mb-6 text-black">
            Get in Touch with Us
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-base-300 text-black">
            Whether you have a question about our services or need assistance,
            we're here to help. Reach out to us, and we'll get back to you as
            soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-8 px-40 bg-gray-100 text-black">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-black">
          {/* Form */}
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-center  mb-2 text-black">
              Contact Form
            </h2>
            <form className="space-y-6 text-black">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Your Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full text-lg shadow-lg focus:ring-2 focus:ring-primary text-black"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-300 text-black">
                    Your Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full text-lg shadow-lg focus:ring-2 focus:ring-primary text-black"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-300 text-black">
                    Your Message
                  </span>
                </label>
                <textarea
                  placeholder="Write your message here..."
                  className="textarea textarea-bordered w-full text-lg shadow-lg focus:ring-2 focus:ring-primary text-black"
                  rows={5}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn bg-primary text-white btn-md shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl text-black font-semibold text-center  mb-6">
              Contact Information
            </h2>
            <div className="space-y-6 text-black">
              <div className="flex text-black items-center space-x-4">
                <PhoneOutlined className="text-3xl text-black text-primary" />
                <p className="text-l text-black ">+123 456 7890</p>
              </div>

              <div className="flex items-center space-x-4">
                <MailOutlined className="text-3xl text-primary" />
                <p className="text-lg text-black">support@carwashbooker.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
