import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import logo from "../../assets/images/whiteLogo.png";

const Welcome = () => {
  useEffect(() => {
    // Lock scroll only for this page
    document.body.classList.add("no-scroll");
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-container {
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
          }
          .mobile-content {
            padding: 1rem;
            gap: 1.5rem;
          }
          .mobile-logo {
            width: 4rem;
            height: 4rem;
          }
          .mobile-title {
            font-size: 1.5rem;
            line-height: 1.2;
          }
          .mobile-subtitle {
            font-size: 0.875rem;
          }
          .mobile-button {
            padding: 0.625rem 0;
            font-size: 0.875rem;
          }
          .mobile-button-spacing {
            gap: 0.75rem;
          }
        }
      `}</style>
      
      <div className="mobile-container h-screen w-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4 md:px-16 overflow-hidden">
        <div className="grid md:grid-cols-2 w-full max-w-6xl rounded-none md:rounded-2xl md:shadow-2xl overflow-hidden h-full md:h-auto">
          {/* Left info section - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-center bg-gray-100 text-gray-800 p-10">
            <div className="max-w-md text-left space-y-4">
              <h2 className="text-3xl font-bold">ABOUT PRAY IN VERSES</h2>
              <p className="text-sm leading-relaxed opacity-80 text-justify">
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
          <div className="mobile-content flex flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary text-white px-6 py-8 md:px-6 md:py-8 flex-1">
            <img 
              src={logo} 
              alt="logo" 
              className="mobile-logo w-32 md:w-32 object-contain flex-shrink-0" 
            />
            
            <div className="text-center flex-shrink-0">
              <h1 className="mobile-title text-4xl md:text-4xl font-bold mb-2">
                Pray in Verses
              </h1>
              <p className="mobile-subtitle text-lg md:text-lg opacity-90">
                Turn every verse into prayers
              </p>
            </div>

            <div className="mobile-button-spacing flex flex-col space-y-4 md:space-y-4 w-full max-w-sm flex-shrink-0">
              <Link to="/signup">
                <Button
                  variant="primary"
                  className="mobile-button w-full py-3 md:py-3 text-lg md:text-lg rounded-xl"
                >
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="tertiary"
                  className="mobile-button w-full py-3 md:py-3 text-lg md:text-lg rounded-xl"
                >
                  Login
                </Button>
              </Link>
              <Link to="/home">
                <Button
                  variant="ghost"
                  className="mobile-button w-full py-3 md:py-3 text-lg md:text-lg rounded-xl"
                >
                  Continue as Guest
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;