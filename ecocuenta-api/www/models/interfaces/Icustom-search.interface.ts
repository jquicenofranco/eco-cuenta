export interface ICustomSearch {
    groupOp: "and" | "or"
    rules: Rule[]
}

export interface Rule {
    field: string
    op: enum_operators
    data: string
}

export enum enum_operators {
    eq = "eq",
    like = "like",
    ilike = "ilike",
}