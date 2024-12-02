import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import axios from "axios";
import FlowchartResult from "../CodeSubmission/FlowchartResult";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function ResultAnalysis({ analysisResult, onGenerateFlowchart }) {
  const [loadingStates, setLoadingStates] = useState({});
  const [flowchartData, setFlowchartData] = useState({}); // To store generated flowchart for each function
  const [error, setError] = useState("");

  // Regular expression to extract Python function names
  const extractFunctionName = (code) => {
    const functionRegex = /def\s+([a-zA-Z_]\w*)\s*\(/g;
    const functionNames = [];
    let match;

    while ((match = functionRegex.exec(code)) !== null) {
      functionNames.push(match[1]);
    }

    return functionNames;
  };

  const handleFlowchartClick = async (functionName, code) => {
    console.log("Generating flowchart for:", functionName);
    console.log("Code:", code);

    // Set the loading state for the selected function
    setLoadingStates((prevState) => ({
      ...prevState,
      [functionName]: true,
    }));

    try {
      const response = await axios.post(
        "https://naduus-codewizard-backend-7eb8b17dcb10.herokuapp.com/generate-flowchart-ag2",
        {
          code: code, 
          language: "python", // Assuming Python for now expandable
          function: extractFunctionName(code)[0], // Send the detected function name
        }
      );

      const data = response.data;

      if (!data.flowchart) {
        throw new Error("Invalid response: No flowchart found.");
      }

      // Store the flowchart data for the function
      setFlowchartData((prevState) => ({
        ...prevState,
        [functionName]: data.flowchart,
      }));

      // Trigger any additional action with flowchart data if needed 
      onGenerateFlowchart(functionName);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred. Please try again later."
      );
    } finally {
      // Reset the loading state for the selected function
      setLoadingStates((prevState) => ({
        ...prevState,
        [functionName]: false,
      }));
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-medium text-white mb-4 text-center">
        Analysis Results
      </h2>

      <motion.div className="grid grid-cols-1 gap-6">
        {/* Imports */}
        {analysisResult.imports.length > 0 && (
          <motion.div
            className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-md shadow-lg border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Imports</h3>
            <pre className="whitespace-pre-wrap text-white overflow-auto">
              {analysisResult.imports.join(", ")}
            </pre>
          </motion.div>
        )}

        {/* Functions */}
        {Object.keys(analysisResult.functions).map((name, index) => (
          <motion.div
            key={index}
            className="bg-blue-800 bg-opacity-20 p-6 rounded-lg backdrop-blur-md shadow-lg border border-blue-500 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
            <div className="flex justify-between items-center">
              <pre className="whitespace-pre-wrap text-white overflow-auto">
                {analysisResult.functions[name]}
              </pre>

              {/* Flowchart Generation Button */}
              <button
                onClick={() =>
                  handleFlowchartClick(name, analysisResult.functions[name])
                }
                className="bg-indigo-600 hover:bg-indigo-400 text-white py-2 px-4 rounded-lg focus:outline-none transition ease-in-out duration-300 ml-4"
              >
                {loadingStates[name] ? (
                  <div className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse">
                    <div className="flex items-center justify-center h-8 w-8 bg-gray-300 rounded">
                      <svg
                        viewBox="0 0 16 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-200"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  "Generate Flowchart"
                )}
              </button>
            </div>

            {/* Display the generated flowchart if available */}
            {flowchartData[name] && (
              <div className="mt-4 bg-opacity-20 backdrop-blur-xl p-4 rounded-lg">
                <h4 className="text-white">Generated Flowchart:</h4>
                <TransformWrapper
                  initialScale={1} // Initial zoom level
                  minScale={0.5} // Minimum zoom level
                  maxScale={4} // Maximum zoom level
                  limitToBounds={false} // Allow panning outside boundaries
                  centerOnInit={true} // Center the content when loaded
                  wheel={{ step: 0.1 }} // Zoom sensitivity when using mouse wheel
                  doubleClick={{ disabled: false, step: 1 }} // Allow zooming with double-click
                  pinch={{ disabled: false, step: 5 }} // Allow pinch zoom on touch devices
                  panning={{ velocityDisabled: true }} // Disables panning momentum after mouse release
                >
                  <TransformComponent>
                    <FlowchartResult flowchartCode={flowchartData[name]} />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            )}
          </motion.div>
        ))}

        {/* Errors */}
        {analysisResult.errors.length > 0 && (
          <motion.div
            className="bg-red-600 bg-opacity-20 p-6 rounded-lg backdrop-blur-md shadow-lg border border-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Errors</h3>
            <pre className="whitespace-pre-wrap text-white overflow-auto">
              {analysisResult.errors.join(", ")}
            </pre>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            className="bg-red-800 text-white mt-4 py-2 px-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

ResultAnalysis.propTypes = {
  analysisResult: PropTypes.shape({
    imports: PropTypes.arrayOf(PropTypes.string),
    functions: PropTypes.objectOf(PropTypes.string),
    errors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onGenerateFlowchart: PropTypes.func.isRequired,
};

export default ResultAnalysis;
