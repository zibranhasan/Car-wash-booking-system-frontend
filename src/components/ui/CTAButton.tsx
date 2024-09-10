import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./CTAButton.css";

const CTAButton = ({
  label,
  targetPath,
}: {
  label: string;
  targetPath: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(targetPath);
  };

  return (
    <Button
      type="primary"
      size="large"
      className="cta-button"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default CTAButton;
