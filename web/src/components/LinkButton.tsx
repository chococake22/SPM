import Link from 'next/link';


interface LinkButtonProps {
  menu: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ menu }) => {

  const divClassName =
    menu === '/'
      ? 'w-[55%] flex items-center justify-center'
      : menu === 'mypage'
        ? 'inline-block align-middle'
        : '';

  const spanClassName =
    menu === '/' ? 'text-2xl font-light text-black-400' : '';

  const menuName = menu === '/' ? 'SPM' : menu;

  return (
    <div className={divClassName}>
      <Link href={menu}>
        <span className={spanClassName}>{menuName}</span>
      </Link>
    </div>
  );
};

export default LinkButton;
