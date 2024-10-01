import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as BabelParser from '@babel/parser';

const CheckSyntaxError = () => {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState([]);
  const [language, setLanguage] = useState('javascript');
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    // Initialize Pyodide for Python syntax checking
    const loadPyodide = async () => {
      const pyodideInstance = await window.loadPyodide();
      setPyodide(pyodideInstance);
    };
    loadPyodide();
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    checkSyntax(value, language);
  };

  const checkSyntax = async (code, language) => {
    try {
      if (language === 'javascript' || language === 'typescript') {
        // JavaScript/TypeScript syntax checking
        const errors = [];
        const parserOptions = {
          sourceType: 'module',
          plugins: {
            jsx: true,
            typescript: language === 'typescript',
          },
        };

        try {
          BabelParser.parse(code, parserOptions);
          setErrors([]);
        } catch (error) {
          const { loc, message } = error;
          const line = loc ? loc.line : 0;
          const column = loc ? loc.column : 0;
          errors.push({
            line,
            column,
            message: `Syntax Error: ${message} (Line ${line}, Column ${column})`,
            suggestion: getFixSuggestion(message),
          });
          setErrors(errors);
        }
      } else if (language === 'python' && pyodide) {
        // Python syntax checking
        try {
          pyodide.runPython(code);
          setErrors([]);
        } catch (error) {
          setErrors([{ line: 0, message: error.message }]);
        }
      } else if (language === 'java') {
        // Java syntax checking using Jdoodle API
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
          script: code,
          language: 'java',
          versionIndex: '0',
          clientId: '287a96a9eff94f013d8dc693449b3a55',
          clientSecret: '930b78a6ae767e5ed1b8a13fc8430388d7df86620e221b10c323e02d30233b1'
        });
        if (response.data.errors) {
          setErrors([{ line: 0, message: response.data.errors }]);
        } else {
          setErrors([]);
        }
      }
    } catch (error) {
      setErrors([{ line: 0, message: error.message }]);
    }
  };

  const getFixSuggestion = (message) => {
    // Return basic suggestions based on common error messages
    if (message.includes('Unexpected token')) {
      return 'Check for missing or extra characters like brackets, commas, or parentheses.';
    }
    if (message.includes('Unexpected end of input')) {
      return 'Make sure all code blocks are properly closed with braces or parentheses.';
    }
    return 'Refer to the code syntax and ensure it follows JavaScript/TypeScript standards.';
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode('');
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 shadow-lg flex items-center justify-between">
        <div className="text-2xl font-extrabold">
          <a href="/home">MyApp</a>
        </div>
        <div className="space-x-6">
          <a href="/home" className="hover:bg-blue-700 p-3 rounded-lg transition-colors">Home</a>
          <a href="/check-syntax" className="bg-blue-700 hover:bg-blue-800 p-3 rounded-lg transition-colors">Check Syntax</a>
          <a href="/profile" className="hover:bg-blue-700 p-3 rounded-lg transition-colors">Profile</a>
          <button
            onClick={() => {
              localStorage.removeItem('token'); // Handle logout
              window.location.href = '/login'; // Redirect to login page
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col">
        <h1 className="text-4xl font-extrabold text-gray-100 mb-6">Check Syntax Error Page</h1>

        <div className="mb-4">
          <label htmlFor="language" className="mr-2 text-lg font-semibold">Choose Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="p-2 border border-gray-600 rounded-lg shadow-md bg-gray-800 text-gray-100"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="w-full max-w-5xl bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
          <Editor
            height="400px"
            defaultLanguage={language}
            defaultValue="// Paste your code here"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 16,
              lineNumbers: 'on',
              renderWhitespace: 'all',
              overviewRulerLanes: 2,
              tabSize: 4,
            }}
          />
        </div>

        {errors.length > 0 && (
          <div className="mt-6 p-4 bg-red-800 text-red-100 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold">Syntax Error</h2>
            {errors.map((error, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>Line {error.line}, Column {error.column}:</strong> {error.message}
                </p>
                <p>
                  <em>Suggestion: {error.suggestion}</em>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckSyntaxError;
