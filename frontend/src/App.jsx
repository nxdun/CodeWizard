// import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

//Home
import Home from "./components/Home/Home";

// // Vishwa
// import Header from "./components/Taskmanagement/Header";
// import Center from "./components/Taskmanagement/Center";
// import boardsSlice from "./redux/boardsSlice";
// import EmptyBoard from "./components/Taskmanagement/EmptyBoard";

//nadun
import Analyzer from "./components/FlowChartGen/Analyzer";

//vinu


//common
import CodeSubmission from "./components/CodeSubmission/CodeSubmission";
import CheckSyntaxError from "./components/Sathira/CheckSyntaxError";
import Login from "./components/Sathira/Auth/Login";
import Register from "./components/Sathira/Auth/Register";
import ProblemHome from "./components/Sathira/ProblemHome";
import Profile from "./components/Sathira/Profile";
import AddProblem from "./components/Sathira/AddProblem";

function App() {
  // const [boardModalOpen, setBoardModalOpen] = useState(false);
  // const dispatch = useDispatch();
  // const boards = useSelector((state) => state.boards);
  // const activeBoard = boards.find((board) => board.isActive);
  // if (!activeBoard && boards.length > 0)
  //   dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));

  return (
    <Router>
      <div>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Vishwa
          <Route
            path="/taskmanagement"
            element={
              <div className=" overflow-hidden  overflow-x-scroll">
                <>
                  {boards.length > 0 ? (
                    <>
                      <Header
                        boardModalOpen={boardModalOpen}
                        setBoardModalOpen={setBoardModalOpen}
                      />
                      <Center
                        boardModalOpen={boardModalOpen}
                        setBoardModalOpen={setBoardModalOpen}
                      />
                    </>
                  ) : (
                    <>
                      <EmptyBoard type="add" />
                    </>
                  )}
                </>
              </div>
            }
          /> */}

          {/* Nadun */}
          <Route
            path="/gen2"
            element={
              <>
                <Analyzer />
              </>
            }
          />
          <Route
            path="/generate"
            element={
              <>
                <CodeSubmission />
              </>
            }
          />

          {/* Vinuki */}
          <Route
            path="/code-analysis"
            element={
              <>
                {/*<CodeAnalysisPage />*/}
                {/* <CodeAnalysisPage /> */}
              </>
            }
          />

          {/* Sathira */}
          <Route
            path="/syntax-error"
            element={
              <>
                <CheckSyntaxError />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Register />
              </>
            }
          />
          <Route
            path="/problemHome"
            element={
              <>
                <ProblemHome />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Profile />
              </>
            }
          />
          <Route
            path="/add-problem"
            element={
              <>
                <AddProblem />
              </>
            }
          />

          {/* disable other routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
