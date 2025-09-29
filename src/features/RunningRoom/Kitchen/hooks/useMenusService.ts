import api from "../../../../services/api";

export type MenuItem = {
  id?: string;
  name: string;
  description: string;
  price: number;
  mealType: string;
  mealCategory: string;
};

export type Menu = {
  id: string;
  menuDate: string;
  items: MenuItem[];
};

export function useMenusService() {
  const fetchWeekly = async (startDate: string, endDate: string) => {
    const { data } = await api.get(`/menus?startDate=${startDate}&endDate=${endDate}`);
    return data;
  };

  const fetchDaily = async (date: string) => {
    const { data } = await api.get(`/menus/menu-by-date?date=${date}`);
    return data;
  };

  const createMenu = async (menu: Omit<Menu, "id">) => {
    const { data } = await api.post("/menus", menu);
    return data;
  };

  const updateMenu = async (id: string, menu: Partial<Menu>) => {
    const { data } = await api.put(`/menus/${id}`, menu);
    return data;
  };

  const deleteMenu = async (id: string) => {
    await api.delete(`/menus/${id}`);
  };

  const addMenuItem = async (menuId: string, item: MenuItem) => {
    const { data } = await api.post(`/menus/${menuId}/items`, item);
    return data;
  };

  const updateMenuItem = async (menuId: string, itemId: string, item: Partial<MenuItem>) => {
    const { data } = await api.put(`/menus/${menuId}/items/${itemId}`, item);
    return data;
  };

  const deleteMenuItem = async (menuId: string, itemId: string) => {
    await api.delete(`/menus/${menuId}/items/${itemId}`);
  };

  return {
    fetchWeekly,
    fetchDaily,
    createMenu,
    updateMenu,
    deleteMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
}
