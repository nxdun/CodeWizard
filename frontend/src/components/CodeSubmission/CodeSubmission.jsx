import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../Home/Header";
import FlowchartResult from "./FlowchartResult"; // Import new component
import ShaderCanvas from "../FlowChartGen/ShaderCanvas"; // Import new component

function CodeSubmission() {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flowchartCode, setFlowchartCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true); // For real-time validity check
  const [indentSize, setIndentSize] = useState(2); // Default indent size

  useEffect(() => {
    // Real-time code validation logic
    if (!codeSnippet.trim()) {
      setIsValidCode(false);
      setError("Code snippet cannot be empty.");
      return;
    }

    // Syntax validation based on selected language
    if (language === "python") {
      try {
        setIsValidCode(true);
        setError("");
      } catch (err) {
        setIsValidCode(false);
        setError("Python syntax error: " + err.message);
      }
    } else if (language === "js") {
      try {
        setIsValidCode(true);
        setError("");
      } catch (err) {
        setIsValidCode(false);
        setError("JavaScript syntax error: " + err.message);
      }
    } else {
      setIsValidCode(false);
      setError("Please select a valid programming language.");
    }
  }, [codeSnippet, language]);

  // Function to extract function name based on language
  const extractFunctionName = (code, lang) => {
    if (lang === "python") {
      const match = code.match(/def\s+([a-zA-Z_]\w*)\s*\(/);
      return match ? match[1] : null;
    } else if (lang === "js") {
      const match = code.match(/function\s+([a-zA-Z_]\w*)\s*\(/) || code.match(/const\s+([a-zA-Z_]\w*)\s*=\s*\(/);
      return match ? match[1] : null;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFlowchartCode("");

    if (!isValidCode || !language) {
      setError("Please fix the errors before submitting.");
      return;
    }

    // Extract the function name
    const functionName = extractFunctionName(codeSnippet, language);
    if (!functionName) {
      setError("Could not detect a valid logic in your code(No function found). Please check your code and try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://naduus-codewizard-backend-7eb8b17dcb10.herokuapp.com/generate-flowchart-ag2",
        {
          code: codeSnippet,
          language: language,
          function: functionName,  // Automatically send detected function name
        }
      );

      const data = response.data;
      console.log(data);

      if (!data.flowchart) {
        throw new Error("Invalid response: No flowchart found.");
      }

      // Add validation for flowchart data
      if (typeof data.flowchart !== "string") {
        throw new Error("Invalid response: No valid flowchart data.");
      }

      setFlowchartCode(data.flowchart);

    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Tab indentation and maintain cursor position
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const value = codeSnippet;
      const indent = " ".repeat(indentSize);
      setCodeSnippet(
        value.substring(0, selectionStart) +
          indent +
          value.substring(selectionEnd)
      );
      // Move the cursor after the inserted indentation
      e.target.selectionStart = e.target.selectionEnd =
        selectionStart + indentSize;
    }
  };

  return (
    <>
      <Header p={false} />
      <ShaderCanvas/>
      <section className="text-gray-400 bg-transparent body-font relative h-screen">
        <div className="container px-5 py-8 mx-auto flex flex-col h-full">
          <div className="flex flex-col text-center w-full mb-6">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
              Code to Flowchart
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Paste your code snippet below to convert it into a flowchart.
            </p>
          </div>

          {/* Code Input Section */}
          <div className="flex flex-grow flex-col lg:w-2/3 mx-auto mb-4">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="relative">
                <label
                  htmlFor="codeSnippet"
                  className="leading-7 text-sm text-gray-400"
                >
                  Code Snippet
                </label>
                <motion.textarea
                  id="codeSnippet"
                  name="codeSnippet"
                  value={codeSnippet}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-white py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  style={{ minHeight: "50vh" }} // Ensuring it takes 2/3 of the height
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {/* Options Section Row */}
              <div className="flex justify-center items-center lg:w-2/3 mx-auto mt-4 space-x-4">
                {/* Indent Size Button */}
                <motion.label
                  className="relative inline-flex items-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={indentSize === 4}
                    onChange={() => setIndentSize(indentSize === 2 ? 4 : 2)}
                  />
                  <div className="peer rounded-br-2xl rounded-tl-2xl outline-none duration-100 after:duration-500 w-28 h-14 bg-indigo-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500 after:content-['2'] after:absolute after:outline-none after:rounded-br-xl after:rounded-tl-xl after:h-12 after:w-12 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['4'] peer-checked:after:border-white"></div>
                </motion.label>

                {/* Quick Paste Example Button */}
                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-400 text-white py-2 px-4 rounded-lg focus:outline-none transition ease-in-out duration-300"
                  onClick={() =>
                    setCodeSnippet(
                      `def example():\n  if True:\n    print("This is a quick-paste example!")\n  else:\n    print("Alternative path")`
                    )
                  }
                >
                  Quick Paste Example
                </button>

                {/* Language Selection Dropdown */}
                <motion.div
                  className="relative inline-block text-left"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 text-white rounded-lg py-2 px-4 outline-none transition ease-in-out duration-300"
                  >
                    <option value="">Select Language</option>
                    <option value="python">Python</option>
                    <option value="js">JavaScript</option>
                  </select>
                </motion.div>
              </div>

              {/* Error Message */}
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

              <button
                type="submit"
                className={`${
                  !isValidCode
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-400"
                } text-white mt-6 py-3 px-6 rounded-lg focus:outline-none transition ease-in-out duration-300`}
                disabled={!isValidCode || !language}
              >
                {loading ? "Generating Flowchart..." : "Generate Flowchart"}
              </button>
            </form>
          </div>

          {/* Flowchart Result */}
          {flowchartCode && (
           <div className="mt-4 bg-black bg-opacity-10 backdrop-blur-xl p-4 rounded-lg overflow-y-auto min-h-[90vh]">
           <FlowchartResult flowchartCode={flowchartCode} />
         </div>
         
          )}
        </div>
      </section>
    </>
  );
}

export default CodeSubmission;
