import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../features/ui/card.tsx";
import dayjs from "dayjs";
import { FaRegEdit, FaCrown, FaCookieBite, FaLeaf, FaTrash, FaUserTie } from "react-icons/fa";

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

type DailyMenuCardProps = {
  menu: Menu;
  onEditMenu?: (menu: Menu) => void;
  onDeleteMenu?: (menuId: string) => void;
  onAddItem?: (menu: Menu) => void;
  onEditItem?: (menu: Menu, menuItem: MenuItem) => void;
  onDeleteItem?: (menuItemId: string, itemId: string) => void;
  cardClassName?: string;
};

// Icon mapping
const mealIcons: Record<string, JSX.Element> = {
  BREAKFAST: <FaCrown />,
  LUNCH: <FaUserTie />,
  DINNER: <FaLeaf />,
  SNACKS: <FaCookieBite />,
};


export default function DailyMenuCard({
  menu,
  onEditMenu,
  onDeleteMenu,
  cardClassName
}: DailyMenuCardProps) {
  // Group items by mealType dynamically
  const grouped = menu.items.reduce((acc: Record<string, MenuItem[]>, item) => {
    acc[item.mealType] = acc[item.mealType] || [];
    acc[item.mealType].push(item);
    return acc;
  }, {});

  // Extract keys dynamically (you can also sort if needed)
  const mealTypes = Object.keys(grouped);

  return (
    <div className={`rounded-lg shadow-md p-4 ${cardClassName}`}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="text-black font-bold font-sans text-sm underline">
              <div>{dayjs(menu.menuDate).format("ddd")}</div>
              <div>{dayjs(menu.menuDate).format("DD-MM-YYYY")}</div>
            </div>

          </CardTitle>
        </CardHeader>


        <CardContent className="space-y-4">
          {mealTypes.map(meal => (
            <div key={meal}>
              <h3 className="font-bold flex justify-between items-center gap-2">

                <span>{meal}</span>
                {mealIcons[meal] || ''}
              </h3>
              <ul className="items-center gap-2 text-gray-500 mb-6"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                {grouped[meal].map(item => {
                  let colorClass = "text-grey-400"; // default VEG
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
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          {onEditMenu && (
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              onClick={() => onEditMenu(menu)}
            >
              <FaRegEdit className="w-4 h-4" />
            </button>
          )}
          {onDeleteMenu && (
            <button
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
              onClick={() => onDeleteMenu(menu.id)}
              aria-label="Delete menu"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          )}
        </CardFooter>



      </Card>
    </div>
  );
}
