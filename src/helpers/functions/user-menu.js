import userMenu from "../data/user-menu.json";
export const getMenuItems = (role) => {
    if(!(role in userMenu) || !role) return;
    const menu = userMenu[role.toLowerCase()];
    return menu;
};
