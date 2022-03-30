import { Plugin } from 'vite'

import { createFilter } from '@rollup/pluginutils'
import * as walk from 'acorn-walk'
import { generate } from 'astring'
import camelCase from 'lodash/camelCase'
import kebabCase from 'lodash/kebabCase'
import upperFirst from 'lodash/upperFirst'

import {
  createImportDeclaration,
  getParentNode,
  isImportDeclaration,
  isProgram,
  replaceNode
} from './utils'

const pascalCase = (string?: string) => {
  return upperFirst(camelCase(string))
}

const NamingMap: Record<string, ((name: string) => string) | undefined> = {
  'kebab-case': kebabCase,
  camelCase: camelCase,
  PascalCase: pascalCase
}

export type NamingStyle = 'kebab-case' | 'camelCase' | 'PascalCase' | 'default'

export type ResolverOptions = {
  /**
   * 被导入的模块标识，import { Button } from 'antd-mobile' 中 name 等于 'Button'
   */
  name: string

  /**
   * 当前被解析文件的 id，一般是文件的绝对路径
   */
  file: string
}

/**
 * 返回 import xxx from 'yyy' 语句中的 yyy
 */
export type Resolver = (options: ResolverOptions) => string

export type DemandImportOptions = {
  /**
   * 类库的名称，用来判断当前 import 语句是否需要处理
   */
  lib: string

  /**
   * 库的命名风格
   *
   * @default  "kebab-case"
   * @description "default" 将不做处理
   */
  namingStyle?: NamingStyle

  /**
   * 路径解析器
   */
  resolver: {
    js?: Resolver // 返回 js 文件的导入路径
    style?: Resolver // 返回样式文件的导入路径
  }
}

const demandImport = ({
  lib,
  resolver,
  namingStyle = 'kebab-case'
}: DemandImportOptions): Plugin => {
  const filter = createFilter(/\.(tsx?|jsx?)/, 'node_modules/**')
  const namingFormatter = NamingMap[namingStyle]

  return {
    name: 'DemandImport',
    transform(code, id) {
      if (!filter(id)) {
        return null
      }

      let newCode = code
      const ast = this.parse(code)

      walk.ancestor(ast, {
        ImportDeclaration(node, _, ancestors) {
          if (!(isImportDeclaration(node) && node.source.value === lib)) {
            return
          }

          const importedNames = node.specifiers
            .map(item => {
              return item.type === 'ImportSpecifier'
                ? {
                    // imported name 支持别名
                    identifier: item.local.name,
                    // module name
                    name: item.imported.name
                  }
                : undefined
            })
            .filter(Boolean)

          const importStatements = importedNames
            .map(({ name, identifier }) => {
              const declarations = []
              const formattedName = namingFormatter?.(name) ?? name

              if (resolver.js)
                declarations.push(
                  createImportDeclaration(
                    resolver.js({ name: formattedName, file: id }),
                    identifier
                  )
                )

              if (resolver.style)
                declarations.push(
                  createImportDeclaration(
                    resolver.style({ name: formattedName, file: id })
                  )
                )

              return declarations
            })
            .flat()

          const parent = getParentNode(ancestors)

          if (!isProgram(parent)) {
            return
          }

          // 因为 replaceNode 会把当前节点删掉，所以这里补回来，不然 js 导入就丢失了
          if (!resolver.js) {
            importStatements.unshift(node)
          }

          replaceNode(parent.body, node, importStatements)

          newCode = generate(ast)
        }
      })

      return {
        code: newCode,
        map: null
      }
    }
  }
}

export default demandImport
