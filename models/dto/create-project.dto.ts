export enum ColorTheme{
    Purple = 1, Cyan = 2, Orange = 3
}

export interface CreateProjectDTO{
    name: string,
    colortheme?: ColorTheme
}