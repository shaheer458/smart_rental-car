import React from 'react';
import { Briefcase, Car, Chart, EmptyWalletChange, Home, InfoCircle, LogoutCurve, Message, Calendar } from 'iconsax-react';

const PanelMenu = ({ onLogout }: { onLogout: () => void }) => {
  const menuItems = [
    { icon: <Home />, label: 'Dashboard' },
    { icon: <Car />, label: 'Car Rent' },
    { icon: <Chart />, label: 'Insight' },
    { icon: <EmptyWalletChange />, label: 'Reimburse' },
    { icon: <Message />, label: 'Inbox' },
    { icon: <Calendar />, label: 'Calendar' },
  ];

  return (
    <div className="w-[20%] bg-white p-4 flex flex-col h-screen">
      <p className="text-[#94A7CB66] text-xs font-semibold mb-4">MAIN MENU</p>
      <ul>
        {menuItems.map(({ icon, label }, index) => (
          <li key={index} className="flex items-center p-4 text-[#90a3bf] rounded-lg mb-2 cursor-pointer hover:bg-[#3563E9] hover:text-white">
            {icon}
            <span className="ml-3">{label}</span>
          </li>
        ))}
      </ul>

      <p className="text-[#94A7CB66] text-xs font-semibold mt-12 mb-4">PREFERENCES</p>
      <ul>
        <li onClick={onLogout} className="flex items-center p-4 text-[#90a3bf] rounded-lg mb-2 cursor-pointer hover:bg-[#3563E9] hover:text-white">
          <LogoutCurve />
          <span className="ml-3">Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default PanelMenu;
