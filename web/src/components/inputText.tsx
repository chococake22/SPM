interface InputTextProps {
  placeholder: string;
}

const inputText: React.FC<InputTextProps> = ({ placeholder }) => {
  return (
    <div className="flex w-full h-full">
      <div className="flex border-2">
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input
            id={placeholder}
            name={placeholder}
            type={
              placeholder.toLowerCase() === 'password' ? 'password' : 'text'
            }
            placeholder={placeholder}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
};

export default inputText;
