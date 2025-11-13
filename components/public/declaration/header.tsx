import { Bell, Settings, User } from "lucide-react";

export const Header: React.FC = () => (
  <header className="flex justify-between items-center">
    <h1 className="text-lg font-semibold flex items-center gap-2">
      <span className="inline-block w-3 h-3 bg-blue-600 rounded-sm" />
      Déclaration d&apos;Impôts
    </h1>
    <div className="flex items-center gap-4">
      <Bell className="w-5 h-5 cursor-pointer" />
      <Settings className="w-5 h-5 cursor-pointer" />
      <User className="w-5 h-5 cursor-pointer" />
    </div>
  </header>
);
