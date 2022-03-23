import { BaseNode, ImportDeclaration, Program } from 'estree'

export const remove = (list: any[], item: any) => {
  const index = list.indexOf(item)
  if (index > -1) {
    list.splice(index, 1)
  }
}

export const replaceNode = (list: any[], current: any, replacements: any[]) => {
  const index = list.indexOf(current)

  if (index > -1) {
    list.splice(index, 1, ...replacements)
  }
}

export const createImportDeclaration = (
  name: string,
  path: string,
  sideEffect: boolean
) => {
  return {
    type: 'ImportDeclaration',
    specifiers: sideEffect
      ? []
      : [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: name
            }
          }
        ],
    source: {
      type: 'Literal',
      value: path,
      raw: `'${path}'`
    }
  }
}

export const getParentNode = (ancestors: any) => {
  return ancestors[ancestors.length - 2]
}

export const isImportDeclaration = (
  node: BaseNode
): node is ImportDeclaration => {
  return node.type === 'ImportDeclaration'
}

export const isProgram = (node: BaseNode): node is Program => {
  return node.type === 'Program'
}
