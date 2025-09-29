import React from "react";
import dayjs from "dayjs";
import DailyMenuCard from "./DailyMenuCard.tsx";
import { useState } from "react";
import { Button } from "../../ui/button.tsx";



type MenuItem = {
  id?: string;
  name: string;
  description: string;
  price: number;
  mealType: string;
  mealCategory: string;
};

type Menu = {
  id: string;
  menuDate: string;
  items: MenuItem[];
};

type WeeklyMenuTableProps = {
  menus: Menu[];
  onEditMenu?: (menu: Menu) => void;
  onDeleteMenu?: (menuId: string) => void;
  cardClassName?: string;
};

const CARD_COLORS = [
  "bg-teal-50",
  "bg-blue-50",
  "bg-green-50",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-orange-50",
  "bg-purple-50",

];

export default function WeeklyMenuTable({
  menus,
  onEditMenu,
  onDeleteMenu,
}: WeeklyMenuTableProps) {
  const sortedMenus = [...menus].sort((a, b) =>
    dayjs(a.menuDate).isBefore(dayjs(b.menuDate)) ? -1 : 1
  );


  return (
    <div className="space-y-4">


      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedMenus.map((menu, idx) => (
            <DailyMenuCard
              key={menu.id}
              menu={menu}
              onEditMenu={onEditMenu}
              onDeleteMenu={onDeleteMenu}
              cardClassName={`text-xs px-1 py-1 ${CARD_COLORS[idx % CARD_COLORS.length]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}