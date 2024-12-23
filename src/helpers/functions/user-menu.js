import userMenu from "../data/user-menu.json";
export const getMenuItems = (role) => {
    //console.log("Role2:", role);
    if(!(role in userMenu) || !role) return;
    //console.log("Role3:", role);
    
    const menu = userMenu[role];
    //console.log("Menu:", menu);
    return menu;
};
