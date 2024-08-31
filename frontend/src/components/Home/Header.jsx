import Wizard from "../../assets/wizard.png";
import PropTypes from "prop-types"; // Corrected import

const Header = ({ p }) => {
  return (
    <header
      className={`text-gray-600 body-font backdrop-blur-sm shadow-lg ${
        p ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center glass-effect">
        <a className="flex title-font font-medium items-center text-gray-200 mb-4 md:mb-0">
          <img src={Wizard} alt="wizard" className="w-10 h-10" />
          <span className="ml-3 text-xl">CodeWizard</span>
        </a>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a className="mr-5 text-gray-200 hover:text-blue-600">Dashboard</a>
          <a className="mr-5 text-gray-200 hover:text-blue-600">About us</a>
          <a className="mr-5 text-gray-200 hover:text-blue-600">Contact</a>
        </nav>
        <button className="inline-flex items-center text-white bg-purple-500 border-0 py-1 px-3 focus:outline-none hover:bg-purple-600 rounded text-base mt-4 md:mt-0">
          Get Started
          <svg
            fill="none"
            stroke="currentColor"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  p: PropTypes.bool, // Corrected PropTypes import and usage
};

export default Header;
