import Link from 'next/link';


interface LinkButtonProps {
  menu: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ menu }) => {

  const divClassName =
    menu === '/'
      ? 'w-[55%]'
      : menu === 'mypage'
        ? 'inline-block align-middle'
        : '';

  const spanClassName =
    menu === '/' ? 'text-3xl font-bold text-yellow-600' : '';

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
