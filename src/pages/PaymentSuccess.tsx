import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const { Title, Paragraph } = Typography;

const PaymentSuccess = () => {
  const navigate = useNavigate(); // Use useNavigate hook

  const handleComplete = () => {
    navigate("/dashboard/user/bookingsManagement"); // Redirect when countdown completes
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <Card className="max-w-md w-full p-8 rounded-lg shadow-lg bg-white text-center">
        <Title level={1} className="mt-4 text-3xl font-bold">
          {" "}
          {/* Increased font size */}
          Payment Successful!
        </Title>
        <Paragraph className="text-lg">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </Paragraph>

        <div className="flex justify-center items-center mt-6">
          <CountdownCircleTimer
            isPlaying
            duration={3} // Countdown duration in seconds
            colors={["#004777", "#F7B801", "#A30000"]}
            colorsTime={[3, 2, 0]} // Color transitions
            onComplete={handleComplete} // Redirect when complete
            size={250} // Increased size of the timer
            strokeWidth={12} // Stroke width of the timer
            trailColor="#d9d9d9" // Trail color
          >
            {({ remainingTime }) => (
              <div className="text-6xl font-bold">{remainingTime}</div> // Make remaining time larger
            )}
          </CountdownCircleTimer>
        </div>

        <Paragraph className="text-xl font-bold mt-4">
          Redirecting in 3 seconds...
        </Paragraph>
        <div className="flex justify-center">
          <Button
            type="primary"
            className="mt-4"
            onClick={() => navigate("/dashboard/user/bookingsManagement")}
          >
            Go to Bookings Management
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
