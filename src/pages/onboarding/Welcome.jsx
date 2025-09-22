import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import logo from "../../assets/images/whiteLogo.png";

const Welcome = () => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-0 max-w-6xl w-full rounded-2xl shadow-2xl overflow-hidden">
        {/* Left info section - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 text-gray-800 p-10">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">ABOUT PRAY IN VERSES</h2>
            <p className="text-sm text-justify leading-relaxed opacity-80">
              Pray in Verses is a unique devotional platform designed to help
              you connect deeply with God's Word through prayer. Instead of
              rushing through chapters or skimming familiar passages, this
              resource guides you to pray scripture itself — one verse at a
              time. Each verse becomes not just something to read, but something
              to internalize, declare, and live out. Our goal is to bridge the
              gap between Bible study and prayer life by turning every verse
              into prayer.
            </p>
          </div>
        </div>

        {/* Right signup/login section */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary text-white py-8 px-6 min-h-[500px]">
          <img src={logo} alt="logo" className="w-32 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Pray in Verses</h1>
          <p className="text-lg opacity-90">Turn every verse into prayers</p>

          <div className="flex flex-col space-y-4 mt-10 w-full max-w-sm">
            <Link to="/signup">
              <Button
                variant="primary"
                className="w-full py-3 text-lg rounded-xl"
              >
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="tertiary"
                className="w-full py-3 text-lg rounded-xl"
              >
                Login
              </Button>
            </Link>
            <Link to="/home">
              <Button
                variant="ghost"
                className="w-full py-3 text-lg rounded-xl"
              >
                Continue as Guest
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
