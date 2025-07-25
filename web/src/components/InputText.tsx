interface InputTextProps {
  id?: string;
  placeholder: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | null;
  value?: string;
  type: string;
  regExp?: string;
  defaultValue?: string;
  readonly?: boolean;
  menuName?: string;
}

const InputText: React.FC<InputTextProps> = ({
  id,
  placeholder,
  name,
  onChange,
  value,
  type,
  regExp,
  defaultValue,
  readonly,
  menuName
}) => {
  
  // validation
  // const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  //   // regExp가 존재하는 경우에만 검증을 수행
  //   if (regExp && !new RegExp(regExp).test(e.target.value)) {
  //     let message = '';
  //     if (name === 'userPw' || name === 'userPwChk') {
  //       message = '비밀번호가 형식에 맞지 않습니다.';
  //       alert(message);
  //     } else if (name === 'userId') {
  //       message = '아이디가 이메일 형식에 맞지 않습니다.';
  //       alert(message);
  //     }
  //   }
  // };

  return (
    <div className="mt-3">
      <label htmlFor={name} className="block mb-2 text-sm font-medium">
        {menuName}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        // onBlur={handleBlur}
        defaultValue={defaultValue}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        readOnly={readonly}
        required
      />
    </div>
  );
};

export default InputText;
