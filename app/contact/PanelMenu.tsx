import {
  Briefcase,
  Calendar,
  Car,
  Chart,
  EmptyWalletChange,
  Home,
  InfoCircle,
  LogoutCurve,
  Message,
  Moon,
  Setting,
  Sun1,
} from "iconsax-react";

const PanelMenu = () => {
  const menuItems = [
    { icon: <Home />, label: "Dashboard" },
    { icon: <Car />, label: "Car Rent" },
    { icon: <Chart />, label: "Insight" },
    { icon: <EmptyWalletChange />, label: "Reimburse" },
    { icon: <Message />, label: "Inbox" },
    { icon: <Calendar />, label: "Calendar" },
  ];

  const preferencesItems = [
    { icon: <Setting color="#90a3bf" />, label: "Settings" },
    { icon: <InfoCircle />, label: "Help & Center" },
    {
      icon: (
        <div className="flex justify-between items-center">
          <Briefcase />
          <span className="ml-3 font-medium text-base">Dark Mode</span>
        </div>
      ),
      label: "Dark Mode",
      isSwitch: true,
    },
  ];

  return (
    <div className="w-[22%] p-4 bg-white hidden lg:flex flex-col justify-between">
      {/* Main Menu */}
      <section>
        <p className="text-[#94A7CB66] text-xs font-semibold p-4 tracking-[3px]">
          MAIN MENU
        </p>
        <ul className="flex flex-wrap h-full">
          {menuItems.map(({ icon, label }, index) => (
            <li
              key={index}
              className="flex items-center p-4 text-[#90a3bf] rounded-[10px] w-full hover:bg-[#3563E9] hover:text-white duration-300 cursor-pointer"
            >
              {icon}
              <span className="ml-3 font-medium text-base">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Preferences */}
      <section className="mt-12">
        <p className="text-[#94A7CB66] text-xs font-semibold p-4 tracking-[3px]">
          PREFERENCES
        </p>
        <ul className="flex flex-wrap h-full">
          {preferencesItems.map(({ icon, label, isSwitch }, index) => (
            <li
              key={index}
              className="mt-4 flex items-center p-4 text-[#90a3bf] rounded-[10px] w-full hover:bg-[#3563E9] hover:text-white duration-300 cursor-pointer"
            >
              {icon}
              {!isSwitch && <span className="ml-3 font-medium text-base">{label}</span>}

              {/* Dark Mode Switch */}
              {isSwitch && (
                <div className="flex justify-between items-center ml-6 bg-[#F6F7F9] rounded-full p-[3px]">
                  <span className="mr-[6px] bg-[#3563E9] p-[3px] rounded-full text-white">
                    <Sun1 />
                  </span>
                  <span>
                    <Moon color="#90a3bf" />
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      {/* Log Out Section */}
      <section className="mt-12">
        <div className="mt-4 flex items-center p-4 text-[#90a3bf] rounded-[10px] w-full hover:bg-[#3563E9] hover:text-white duration-300 cursor-pointer">
          <LogoutCurve />
          <span className="ml-3 font-medium text-base">Log Out</span>
        </div>
      </section>
    </div>
  );
};

export default PanelMenu;
