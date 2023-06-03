type IItem = string | any[] | {
    [key: string]: any
};

type ThemeSettings<T extends string> = {
    [category in T]?: IItem
}


export default ThemeSettings
