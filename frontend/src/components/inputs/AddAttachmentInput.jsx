import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = React.useState("");

  const addAttachment = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };
  const deleteAttachment = (i) => {
    const updatedArr = attachments.filter((_, id) => id !== i);
    setAttachments(updatedArr);
  };
  return (
    <div>
      {attachments.map((item, i) => (
        <div
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 mb-3 mt-2 rounded-md"
          key={i}
        >
          <div className="flex flex-1 items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black">{item}</p>
          </div>
          <button
            className="cursor-pointer"
            onClick={() => deleteAttachment(i)}
          >
            <HiOutlineTrash className="text-xs text-red-500" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-5 mt-4">
        <div className="flex flex-1 items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full outline-none text-[13px] text-black bg-white py-2"
          />
        </div>
        <button className="card-btn text-nowrap" onClick={addAttachment}>
          <HiMiniPlus className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentInput;
