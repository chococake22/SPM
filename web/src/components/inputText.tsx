interface InputTextProps {
  placeholder: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | null;
  value?: string;
  type: string;
  regExp?: string;
  defaultValue?: string;
}

const inputText: React.FC<InputTextProps> = ({
  placeholder,
  name,
  onChange,
  value,
  type,
  regExp,
  defaultValue,
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // regExp가 존재하는 경우에만 검증을 수행
    if (regExp && !new RegExp(regExp).test(e.target.value)) {
      let message = '';
      if (name === 'userPw' || name === 'userPwChk') {
        message = '비밀번호가 형식에 맞지 않습니다.';
        alert(message);
      } else if (name === 'userId') {
        message = '아이디가 이메일 형식에 맞지 않습니다.';
        alert(message);
      }
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex border-2 w-full">
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            className="block grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
};

export default inputText;
