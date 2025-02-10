import LinkButton from './linkButton';

const topNav = () => {
  return (
    <div>
      <nav className="flex justify-evenly border-b-2 align-middle items-center">
        <LinkButton menu="/" />
        <LinkButton menu="mypage" />
        <LinkButton menu="settings" />
      </nav>
    </div>
  );
};

export default topNav;
