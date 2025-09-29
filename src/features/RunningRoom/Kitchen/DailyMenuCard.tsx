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
    <div className={`rounded-lg shadow-md p-4 w-full h-full ${cardClassName}`}>
      <Card className="w-full h-full flex flex-col">
<CardHeader className="rounded-t-lg px-4 py-2">
  <CardTitle>
    <div className="flex justify-between items-center font-bold font-sans text-sm w-full">
      <span>{dayjs(menu.menuDate).format("ddd")}</span>
      <span>{dayjs(menu.menuDate).format("DD-MM-YYYY")}</span>
    </div>
  </CardTitle>
  <div className="h-px bg-gray-300" />
</CardHeader>


        <CardContent className="space-y-2 overflow-hidden">
          {mealTypes.map(meal => (
            <div key={meal} className="min-w-0">
              <h3 className="font-bold flex justify-between items-start gap-2 truncate">
                <span className="truncate">{meal}</span>
                {mealIcons[meal] || ''}
              </h3>
              <ul
                className="items-center gap-2 text-gray-800 mb-6 break-words"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
              >
                {grouped[meal].map(item => {
                  let colorClass = "text-gray-800";
                  if (item.mealCategory === "NON_VEG") colorClass = "text-red-600";
                  return (
                    <li key={item.id} className="flex justify-between items-start">
                      <span className={`font-semibold truncate ${colorClass} flex flex-col`}>
                        <span>{item.name}</span>
                        <span className="font-normal text-xs text-gray-500">{item.description}</span>
                      </span>

                      <span className="ml-2 text-xs text-gray-600 whitespace-nowrap">
                        ₹{item.price}
                      </span>
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
