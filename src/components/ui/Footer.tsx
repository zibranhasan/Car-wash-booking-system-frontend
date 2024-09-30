// src/components/ui/Footer.js
const Footer = () => {
  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#001529",
        color: "#fff",
      }}
    >
      <p>© {new Date().getFullYear()} CarWashBooker. All rights reserved.</p>
      <div>
        <a href="/contact" style={{ color: "#fff", margin: "0 10px" }}>
          Contact Us
        </a>
        <a href="/privacy" style={{ color: "#fff", margin: "0 10px" }}>
          Privacy Policy
        </a>
        <a href="/terms" style={{ color: "#fff", margin: "0 10px" }}>
          Terms of Service
        </a>
        {/* Add social media links here */}
      </div>
    </div>
  );
};

export default Footer;
