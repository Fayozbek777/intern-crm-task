import React from "react";
import { LogOut, User, Users } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center justify-center bg-black text-white p-3 rounded-lg shadow-md">
          <Users className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-semibold text-gray-800">CorpCRM</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0f172b] rounded-full flex items-center justify-center text-white text-sm font-medium">
            BS
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
