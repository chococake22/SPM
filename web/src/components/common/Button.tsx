interface ButtonProps {
  buttonName: string;
  onClick?: () => void;
  type?: string
}

const Button: React.FC<ButtonProps> = ({ buttonName, onClick, type }) => {
  const baseStyle =
    'text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 focus:outline-none focus:ring-4';

  // 버튼 이름에 따라 스타일 매핑
  const styleMap: Record<string, string> = {
    Reset:
      'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900',
    Submit:
      'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900',
    Cancel:
      'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-500',
    Login:
      'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 me-2 mb-2',
    SignUp:
      'bg-purple-700 hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mb-2',

    Logout:
      'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
    innerDOM:
      'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
    childDOM:
      'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
  };

  // 아무것도 없는 경우 공통
  const variantStyle = styleMap[buttonName] ?? 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300';

  const buttonType = type === "submit" ? "submit" : "button";

  return (
    <button
      type={buttonType}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle}`}
    >
      {buttonName}
    </button>
  );
};

export default Button;
