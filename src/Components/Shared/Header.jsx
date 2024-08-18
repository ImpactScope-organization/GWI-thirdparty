import { useStepsContext } from "../../Context/StateContext";

const Header = () => {
  const { openLoginModal, setOpenLoginModal } = useStepsContext();

  return (
    <div className="bg-darkBlack">
      <div className="flex justify-between items-center  py-5 w-[90%] mx-auto ">
        {/* Left */}
        <div className="flex justify-between gap-20 items-center">
          <img src="/assets/logo.png" alt="logo" />
        </div>

        <div className="flex justify-center items-center gap-10">
          <img
            src="./assets/profile.png"
            alt="logo"
            className="cursor-pointer"
            onClick={() => setOpenLoginModal(!openLoginModal)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
