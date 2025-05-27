import React from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

const TodoListInput = ({ todolist, setTodolist }) => {
  const [option, setOption] = React.useState("");
  const addHandler = () => {
    if (option.trim()) {
      setTodolist([...todolist, option.trim()]);
      setOption("");
    }
  };
  const deleteHandler = (i) => {
    const updatedArr = todolist.filter((_, id) => id !== i);
    setTodolist(updatedArr);
  };
  return (
    <div>
      {todolist.map((item, i) => (
        <div
          className="flex justify-between bg-gray-50 border border-gray-500 px-3 py-2 rounded-md mb-3 mt-2"
          key={i}
        >
          <p className="text-xs text-black">
            <span className="text-[13px] text-gray-400 mr-2 font-semibold">
              {i < 9 ? `0${i + 1}` : i + 1}
            </span>
            {item}
          </p>
          <button onClick={() => deleteHandler(i)} className="cursor-pointer">
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      <div className="flex gap-5 items-center mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full outline-none bg-white text-black text-[13px] border border-gray-400 px-3 py-2 rounded-md"
        />
        <button onClick={addHandler} className="card-btn text-nowrap">
          <HiMiniPlus className="text-base" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
