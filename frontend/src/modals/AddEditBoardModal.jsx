import { useState } from "react";
import crossIcon from "../assets/icon-cross.svg";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import boardsSlice from "../redux/boardsSlice";
function AddEditBoardModal({ setBoardModalOpen , type ,  }) {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [newColumns, setNewColumns] = useState([
        { name: "Todo", tasks: [], id: uuidv4() },
        { name: "In Progress", tasks: [], id: uuidv4() },
    ]);
    const onChange = (id, newValue) => {
        setNewColumns((prevState) => {
          const newState = [...prevState];
          const column = newState.find((col) => col.id === id);
          column.name = newValue;
          return newState;
        });
    };
    const onDelete = (id) => {
        setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
    };
    const validate = () => {
        setIsValid(false);
        setErrorMessage(""); // Reset the error message
        if (!name.trim()) {
          setErrorMessage("Board name is required.");
          return false;
        }
        for (let i = 0 ; i < newColumns.length ; i++) {
          if (!newColumns[i].name.trim()) {
            return false;
          }
        }
        setIsValid(true);
        return true;
      };
      const onSubmit = (type) => {
        setBoardModalOpen(false);
        if (type === "add") {
          dispatch(boardsSlice.actions.addBoard({ name, newColumns }));
        } else {
          dispatch(boardsSlice.actions.editBoard({ name, newColumns }));
        }
      };
   
    return (
    <div
    className="  fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown " 
    onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);
      }}
    >
        {/* Modal Selection */}
        <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
        >
            <h3 className=" text-lg ">
                {type === "edit" ? "Edit" : "Add New"} Board
            </h3>
            {/* Task Name */}
            <div className="mt-8 flex flex-col space-y-1">
                <label className="  text-sm dark:text-white text-gray-500">
                Board Name
                </label>
                <input
                className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 outline-none focus:outline-[#635fc7] outline-1  ring-0  "
                placeholder=" e.g Web Design"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="board-name-input"
            />
             {!isValid && <span className="text-red-500 text-xs">{errorMessage}</span>}
            </div>
            {/* Board Columns */}
            <div className="mt-8 flex flex-col space-y-3">
                <label className=" text-sm dark:text-white text-gray-500">
                    Board Columns
                </label>
                {
                    newColumns.map((column, index) => (
                        <div key={index} className=" flex items-center w-full ">
                            <input
                            className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                            onChange={(e) => {
                            onChange(column.id, e.target.value);
                            }}
                            type="text"
                            value={column.name}
                            />
                            <img
                            src={crossIcon}
                            onClick={() => {
                            onDelete(column.id);
                            }}
                            className=" m-4 cursor-pointer "
                            />
                        </div>
                    ))
                }
            </div>
            <div>
            <button
              className=" w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 nt-2 rounded-full "
              onClick={() => {
                setNewColumns((state) => [
                  ...state,
                  { name: "", tasks: [], id: uuidv4() },
                ]);
              }}
            >
              + Add New Column
            </button>
            <button
              onClick={() => {
                const isValid = validate();
                if (isValid === true) onSubmit(type);
              }}
              className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
            </div>
        </div>
        
    </div>
  )
}
export default AddEditBoardModal