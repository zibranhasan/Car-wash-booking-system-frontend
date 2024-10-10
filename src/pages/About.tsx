import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-white text-base-content min-h-screen">
      {/* Hero Section */}
      <section className="hero bg-gray-100 text-base-200 py-20 transition duration-500 hover:bg-gray-200">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fadeIn">
            About CarWashBooker
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90 transition-transform transform hover:scale-105">
            CarWashBooker is your go-to platform for effortless car wash
            scheduling. Whether you're at home, at work, or on the go, our
            platform allows you to easily book professional car wash services at
            a time and place that suits you best.
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-gray-100 transition duration-700 hover:bg-gray-200">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 animate-slideUp">
            What We Do
          </h2>
          <p className="text-lg max-w-3xl mx-auto opacity-90 transition-transform transform hover:scale-105">
            At CarWashBooker, we connect car owners with trusted and experienced
            car wash professionals. Our platform provides a user-friendly
            experience, allowing you to select your preferred services, choose a
            time slot, and confirm your booking in a matter of minutes. We are
            committed to offering a hassle-free experience and ensuring that
            your vehicle looks its best, wherever you are.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-gray-100 transition duration-700 hover:bg-gray-200">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 animate-slideUp">
            Our Mission
          </h2>
          <p className="text-lg max-w-3xl mx-auto opacity-90 transition-transform transform hover:scale-105">
            Our mission is to make car wash services more accessible,
            convenient, and reliable for everyone. We aim to take the stress out
            of maintaining your vehicle by offering top-notch services at
            competitive prices, backed by excellent customer support.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-100 transition duration-700 hover:bg-gray-200">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 animate-slideUp">
            Why Choose CarWashBooker?
          </h2>
          <p className="text-lg max-w-3xl mx-auto opacity-90 transition-transform transform hover:scale-105">
            CarWashBooker stands out from the crowd by offering flexibility,
            transparency, and trustworthiness. Our platform is designed with you
            in mind, giving you complete control over your bookings, whether
            it's scheduling, rescheduling, or canceling appointments. With
            real-time slot availability and multiple payment options, we ensure
            that the process is as smooth as possible.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100 text-center transition duration-700 hover:bg-gray-200">
        <h2 className="text-3xl font-bold mb-6 animate-slideUp">
          Join Us Today!
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-6 opacity-90 transition-transform transform hover:scale-105">
          Experience the convenience of CarWashBooker and make car wash services
          a breeze. Sign up now to enjoy seamless booking, trusted services, and
          top-notch customer support.
        </p>
        <Link
          to="/register"
          className="btn text-white bg-base-200 btn-md shadow-lg transition-all hover:shadow-2xl hover:scale-105"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default About;
