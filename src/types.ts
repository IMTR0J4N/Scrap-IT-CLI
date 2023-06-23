import * as HTMLParser from  "node-html-parser"

export type HTMLScrapOpt = {
    includeStyle: boolean,
    includeScript: boolean,
}

export type TemplateSetOpt = {
    template: templatesList
}

export type StylesTagObj = {
    stylesTag: HTMLParser.HTMLElement[],
    linkStyleTag: HTMLParser.HTMLElement[]
}

type templatesList = 'html' | 'html-js' | 'html-css' | 'html-css-js'