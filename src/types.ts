export type HTMLScrapOpt = {
    includeStyle: boolean,
    includeScript: boolean,
}

export type TemplateSetOpt = {
    template: templatesList
}

type templatesList = 'html' | 'html-js' | 'html-css' | 'html-css-js'