import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../features/ui/card.tsx";
import dayjs from "dayjs";

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

const CARD_COLORS = [
  "bg-blue-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-pink-50",
  "bg-purple-50",
  "bg-orange-50",
  "bg-teal-50",
];



const MEAL_ORDER = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];

type DailyMenuCardProps = {
  menu: Menu;
  onEditMenu?: (menu: Menu) => void;
  onDeleteMenu?: (menuId: string) => void;
  onAddItem?: (menu: Menu) => void;
  onEditItem?: (menu: Menu, menuItem: MenuItem) => void;
  onDeleteItem?: (menuItemId: string, itemId: string) => void;
  cardClassName?: string;
};



export default function DailyMenuCard({
  menu,
  onEditMenu,
  onDeleteMenu,
  onAddItem,
  onEditItem,
  onDeleteItem,
  cardClassName
}: DailyMenuCardProps) {


  const grouped = menu.items.reduce((acc: Record<string, MenuItem[]>, item) => {
    acc[item.mealType] = acc[item.mealType] || [];
    acc[item.mealType].push(item);
    return acc;
  }, {});

  return (
    <div className={`rounded-lg shadow-md p-4 bg-white ${cardClassName} `}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="text-black font-bold font-sans text-sm inline-block underline">
              {dayjs(menu.menuDate).format("ddd, MMM D, YYYY")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MEAL_ORDER.map(meal => (
            grouped[meal] && (
              <div key={meal}>
                <h3 className="font-bold">{meal}</h3>
                <ul className="ml-4 list-disc">
                  {grouped[meal].map(item => {
                    let colorClass = "text-green-700"; // default for VEG
                    if (item.mealCategory === "VEGAN") colorClass = "text-green-400";
                    if (item.mealCategory === "NON_VEG") colorClass = "text-red-600";
                    return (
                      <li key={item.id} className="flex justify-between items-center">
                        <span className={`font-semibold ${colorClass}`}>{item.name}</span>
                        <span className="ml-2 text-xs text-gray-600">₹{item.price}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
