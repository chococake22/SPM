import LinkButton from './LinkButton';

const topNav = () => {
  return (
    <div>
      <nav className="flex fixed w-full justify-evenly border-b-2 align-middle items-center bg-slate-100">
        <LinkButton menu="/" />
        <LinkButton menu="mypage" />
        <LinkButton menu="settings" />
      </nav>
    </div>
  );
};

export default topNav;
