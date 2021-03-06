
[![Release](https://github.com/liuweiGL/vite-plugin-demand-import/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/liuweiGL/vite-plugin-demand-import/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/vite-plugin-demand-import.svg)](https://badge.fury.io/js/vite-plugin-demand-import)

## [ðEnglish Document](./README_EN.md)
## Vite Plugin Demand Import

ä¸º **å¸¦æå¯ä½ç¨** çåºæä¾ âæéå è½½â åè½ã

## å¿«éå¼å§

```shell
pnpm add vite-plugin-demand-import -D
```

```ts
import { defineConfig } from 'vite'
import demandImport from 'vite-plugin-demand-import'

export default defineConfig({
  plugins: [
    demandImport({
      lib: 'antd-mobile',
      resolver: {
        js({ name }) {
          return `antd-mobile/es/components/${name}`
        }
      }
    })
  ]
})

/////////// ç¼è¯ç»æ ////////////
import { Button } from 'antd-mobile'

â â â â â â

import Button from 'antd-mobile/es/components/button'
```

## ä¼åææ

<details>
<summary>å¯¹æ¯</summary>   

![before.png](./assets/before.png)

---

![after.png](./assets/after.png)

</details>

## æ¥å£

```ts
export type ResolverOptions = {
  /**
   * è¢«å¯¼å¥çæ¨¡åæ è¯ï¼import { Button } from 'antd-mobile' ä¸­ name ç­äº 'Button'
   */
  name: string

  /**
   * å½åè¢«è§£ææä»¶ç idï¼ä¸è¬æ¯æä»¶çç»å¯¹è·¯å¾
   */
  file: string
}

/**
 * è¿å import xxx from 'yyy' è¯­å¥ä¸­ç yyy
 */
export type Resolver = (options: ResolverOptions) => string

export type DemandImportOptions = {
  /**
   * ç±»åºçåç§°ï¼ç¨æ¥å¤æ­å½å import è¯­å¥æ¯å¦éè¦å¤ç
   */
  lib: string

  /**
   * åºçå½åé£æ ¼
   *
   * @default  "kebab-case"
   * @description "default" å°ä¸åå¤ç
   */
  namingStyle?: 'kebab-case' | 'camelCase' | 'PascalCase' | 'default'

  /**
   * è·¯å¾è§£æå¨
   */
  resolver: {
    js?: Resolver // è¿å js æä»¶çå¯¼å¥è·¯å¾
    style?: Resolver // è¿åæ ·å¼æä»¶çå¯¼å¥è·¯å¾
  }
}
```

## Why

å¨ä½¿ç¨åç§ âxxx-importâ æä»¶ä¹åæä»¬éè¦ååºåå ä¸ªæ¦å¿µï¼

1. tree shakingï¼ä¸­æ âææ âï¼æå¯¹æ²¡æä½¿ç¨å°çä»£ç å¨ `ç¼è¯é¶æ®µ` è¿è¡å åã
2. èªå¨å¯¼å¥ï¼æ ¹æ®éç½®çç­ç¥å¨ `ç¼è¯é¶æ®µ` èªå¨æå¥å¯¼å¥è¯­å¥ã
3. æéå è½½ï¼æå¨ `è¿è¡æ¶` å¨æè¿åç¨æ·å½åè®¿é®çèµæºã

ç®åçä»£ç è¯´æï¼

1. tree shaking:

```ts
// a.js
export const a1 = 1
export const a2 = 2

//b.js
export const b1 = 1
export const b2 = 2

// index.js
import { a1 } from './a'
import { b1 } from './b'

console.log(a1)

////////// ä½¿ç¨ rollup æå ////////////

// dist/index.js
const a1 = 1
console.log(a1)
```

`a.js` & `b.js` ä¸­æ²¡æç¨å°çä»£ç é½è¢«å åæäºã

2. èªå¨å¯¼å¥ï¼

```ts
import { Button } from 'antd'

///////// ä½¿ç¨ xxx-import æä»¶ /////////
import { Button } from 'antd'
// èªå¨æå¥äºæ ·å¼çå¯¼å¥è¯­å¥
import 'antd/lib/style/button/index.less'
```

3. æéå è½½ï¼

```ts
if (location.pathname.include('/login')) {
  import('./login.js').then((res) => {
    // do something
  })
}
```

ç®åä¸»è¦æ¯è·¯ç±ä¸­ç¨çå¤ï¼æ¯å¦ `vue-router`ã`react-router` ä¸­æä»¬ç»å¸¸ä¼éç½®ï¼

```ts
export const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('./Login/index')
  }
]
```

éè¦æ³¨æçæ¯ **æ¥å¸¸è¡¨è¿°ä¸­** âæéå è½½â å¨ä¸åçåºæ¯ä¸è· âtree shakingâ æè âèªå¨å¯¼å¥â æ¯ç­ä»·çãæ¯å¦ï¼

1. æä»¬ä½¿ç¨ lodash åºæ¶ææçæ¯ âtree shakingâ è¡ä¸ºï¼ä½æ¯æä»¬ä¹å¯ä»¥è¯´æ âæéå è½½â lodashã
2. æä»¬å¨ä½¿ç¨ UI åºæ¶ææçæ¯ âèªå¨å¯¼å¥â è¡ä¸ºï¼ä½æ¯æä»¬ä¹å¯ä»¥è¯´æ âæéå è½½â æ ·å¼ã

## tree shaking

ç½ä¸å³äºè¿ä¸ªç¹æ§çæç« å¾å¤äºï¼è¿éåªå¤§æ¦è¯´ä¸ä¸æç¥éçå ç§æ¹å¼ï¼

1. esm è§èç export & import æ¯éæç»å®çï¼rollup ç¼è¯æ¶å¯ä»¥åæåºåªä¸ªæ¨¡åæ¯ç¨å°çåªä¸ªæ¨¡åæ¯æ²¡ç¨å°çï¼åªè¦ç±»åºç package.json ç³æäº `sideEffects: false` ä¾¿å¯ä»¥èªå¨ tree shakingã
2. commonjs è§èç require æ¯å¨æçï¼æä»¥ tree shaking æ¯éå¸¸å°é¾çãrollup å¤ç commonjs æ¨¡åæ¶ä¾èµ `@rollup/plugin-commonjs` æä»¶è¿è¡ commonjs å° esm çè½¬æ¢ãè¿ä¸ªæä»¶é»è®¤çè¡ä¸ºæ¯ï¼å¦ææ¨¡åä½¿ç¨ `exports.xxx` å¯¼åºä¼ tree shakingï¼è `modules.exports` å¯¼åºåä¸ä¼ã
3. æå¨æå®åä¸é¢çå·ä½æ¨¡åï¼æ¯å¦ä½¿ç¨ `import round from 'lodash/round'` ä»£æ¿ `import { round } from 'lodash'`ã

å³äºè¿åå¯ä»¥ä½¿ç¨ `lodash` è· `lodash-es` è¿è¡æµè¯ï¼åèä¸ä¼ tree shaking èåèä¼ã

### éæ&å¨æå¯¼å¥çç®åè§£é

ä¸å¥è¯æ¦æ¬å°±æ¯å¯ä»¥å¨è¿è¡æ¶æéå¯¼å¥çå°±æ¯âå¨æå¯¼å¥âï¼å¨ç¼ç æ¶åæ­»çå°±æ¯âéæå¯¼å¥âï¼

```ts
import a from 'a' // éæå¯¼å¥

if (flag) {
  import 'a' // å¨æå¯¼å¥ï¼esm ä¸æ¯æè¯¥è¡ä¸º
}
```

```ts
const a = require('a') // éæå¯¼å¥

if (flag) {
  require('a') // å¨æå¯¼å¥ï¼commonjs æ¯æè¯¥è¡ä¸º
}
```

## ç®åå·²æç `xxx-import` æä»¶

### [babel-plugin-import](https://github.com/umijs/babel-plugin-import)

antd å®æ¹åºåï¼æè§å¯ä»¥ç®è¿ä¸ªé¢åæç¥åçç±»åºå§ï¼åè½éå¸¸é½å¨ãæ¯å¦ï¼

1. tree shaking: å ä¸ºå½æ¶è¿æ¯ webpack çå¤©ä¸ï¼å¤§å¤æ°çåä¹é½æ¯ commonjs è§èçï¼æä»¥å½æ¶ä¸è¬é½æ¯ä½¿ç¨ç¬¬ä¸ç§æ¹å¼æ¥å®ç°è¯¥ç¹æ§ãå¯¹åºçéç½®ä¸ºï¼

```ts
// .babelrc
{
  "plugins": [["import", {
      "libraryName": "antd"
  }]]
}

// ææ
import { Button } from 'antd';

      â â â â â â

var _button = require('antd/lib/button');

```

2. èªå¨å¯¼å¥ï¼ä½¿ç¨ UI åºçæ¶åä¸è¬å¯ä»¥éæ© âå¨å±å¯¼å¥â å âæéå¯¼å¥â å¼å¥æ ·å¼æä»¶ï¼å½éæ©åèçæ¶åå°±å¯ä»¥è®©æä»¶å¸®æä»¬èªå¨æå¥å¯¼å¥è¯­å¥ï¼

```ts
// .babelrc
{
  "plugins": [["import", {
      "libraryName": "antd",
      style: true
  }]]
}

// ææ
import { Button } from 'antd';


      â â â â â â

var _button = require('antd/lib/button');
require('antd/lib/button/style'); // èªå¨æå¥äºå¯¼å¥è¯­å¥
```

è¿éåªå±ç¤ºæç®åçç¨æ³ï¼æ´å¤å¤æçéç½®å¯ä»¥æ¥çå®æ¹ææ¡£ï¼æè§åºæ¬æ²¡æè§£å³ä¸äºçåºæ¯ã

ä¸è¿éç esm çæ®åä»¥åå¨å¸¸è§é¡¹ç®ä¸­ âå¨å±å¯¼å¥â æ¯ âæéå è½½â å¹¶ä¸ä¼å¤§å¤å°ä½ç§¯ï¼æä»¥ä½èæ¨è<sup>?</sup> ç¨ âå¨å±å¯¼å¥â ä»£æ¿ âæéå è½½âï¼è¿ä¸ªæä»¶ä¹å°±ä¸åéè¦äºã

> ç¸å³ç»è®ºæ¯ babel-plugin-import æä¸ª issue ä¸­ä½èè¯´çï¼ä¸æ¶æ¾ä¸å°é¾æ¥äº ~~~

### [vite-plugin-style-import](https://github.com/vbenjs/vite-plugin-style-import)

åºå¦å¶åï¼è¿ä¸ªæ¯ vite æ¡æ¶çæä»¶ã

å ä¸º vite æ¯åºäº rollup æå»ºçï¼js ä»£ç ä¸è¬é½å¯ä»¥èªå¨ tree shakingï¼æä»¥åªéè¦å¤çæ ·å¼æä»¶ç âèªå¨å¯¼å¥â å°±å¥½äºï¼

```ts
import { ElButton } from 'element-plus';

        â â â â â â

// dev
import { Button } from 'element-plus';
import 'element-plus/lib/theme-chalk/el-button.css`;

// prod
import Button from 'element-plus/lib/el-button';
import 'element-plus/lib/theme-chalk/el-button.css';
```

å¼å¾ä¸æçæ¯ä½èéå¸¸ç»å¿çåºåäºå¼åè·æ­£å¼ç¯å¢:

1. å¼åç¯å¢ä¸­ vite ç optimize ä¸ä¼å ä¸ºæ°çç»ä»¶å¯¼å¥èå·æ°ã
2. å¯è½æ¯ææäºç±»åºæ²¡æéç½® `sideEffects` å¯¼è´ tree shaking ä¸çæï¼

## æéå°çé®é¢

ä¸é¢æ¯äºé£ä¹å¤ç»äºå°éç¹äºï¼ååã

å¶å®é®é¢è¿æ¯åºå¨ UI åºæå»ºæ¶å¯¹æ ·å¼çå¤çå·®å¼ä¸ï¼æ¯å¦ antd çç»ä»¶ä»£ç è·æ ·å¼æ¯åç¦»çï¼

```
button
    |ââ style/index.js
    âââ index.js
```

è¿æ¶åä½¿ç¨ vite-plugin-style-import èªå¨å¯¼å¥æ ·å¼å°±å¥½äºã

ä½æ¯ [antd-mobile](https://github.com/ant-design/ant-design-mobile) æå»ºåºæ¥çæ¯ï¼

```
button
    |ââ button.css
    |ââ button.js
    âââ index.js
```

```ts
// index.js
import './button.css'
import { Button } from './button'
export default Button
```

å®æ¹ä¸ºäºâæ¹ä¾¿âç¨æ·ä½¿ç¨èèªå¨å¨ç»ä»¶å¥å£å¼å¥äºæ ·å¼æä»¶ï¼å¯¹åºç `sideEffects` éç½®ï¼

```ts
  "sideEffects": [
    "**/*.css",
    "**/*.less",
    "./es/index.js",
    "./src/index.ts",
    "./es/global/index.js",
    "./src/global/index.ts"
  ],
```

å½æä»¬å¨ vite ä¸­ä½¿ç¨æ¶ï¼

```ts
import { Button } from 'antd-mobile'
```

ç¬¬ä¸æ­¥ï¼rollup ä¼å» _node_module/antd-mobile/package.json_ ä¸­æ¥ç `module` æè `main` å­æ®µå®ä¹çå¥å£æä»¶ã

ç¬¬äºæ­¥ï¼æ¾å° _node_module/antd-mobile/es/index.js_ æä»¶ï¼

<details>
 <summary>index.js</summary>
 <pre>
import './global';
export { setDefaultConfig } from './components/config-provider';
export { default as ActionSheet } from './components/action-sheet';
export { default as AutoCenter } from './components/auto-center';
export { default as Avatar } from './components/avatar';
export { default as Badge } from './components/badge';
export { default as Button } from './components/button';
export { default as Calendar } from './components/calendar';
export { default as CapsuleTabs } from './components/capsule-tabs';
export { default as Card } from './components/card';
export { default as CascadePicker } from './components/cascade-picker';
export { default as CascadePickerView } from './components/cascade-picker-view';
export { default as Cascader } from './components/cascader';
export { default as CascaderView } from './components/cascader-view';
export { default as CheckList } from './components/check-list';
export { default as Checkbox } from './components/checkbox';
export { default as Collapse } from './components/collapse';
export { default as ConfigProvider } from './components/config-provider';
export { default as DatePicker } from './components/date-picker';
export { default as DatePickerView } from './components/date-picker-view';
export { default as Dialog } from './components/dialog';
export { default as Divider } from './components/divider';
export { default as DotLoading } from './components/dot-loading';
export { default as Dropdown } from './components/dropdown';
export { default as Ellipsis } from './components/ellipsis';
export { default as Empty } from './components/empty';
export { default as ErrorBlock } from './components/error-block';
export { default as FloatingBubble } from './components/floating-bubble';
export { default as FloatingPanel } from './components/floating-panel';
export { default as Form } from './components/form';
export { default as Grid } from './components/grid';
export { default as Image } from './components/image';
export { default as ImageUploader } from './components/image-uploader';
export { default as ImageViewer } from './components/image-viewer';
export { default as IndexBar } from './components/index-bar';
export { default as InfiniteScroll } from './components/infinite-scroll';
export { default as Input } from './components/input';
export { default as JumboTabs } from './components/jumbo-tabs';
export { default as List } from './components/list';
export { default as Loading } from './components/loading';
export { default as Mask } from './components/mask';
export { default as Modal } from './components/modal';
export { default as NavBar } from './components/nav-bar';
export { default as NoticeBar } from './components/notice-bar';
export { default as NumberKeyboard } from './components/number-keyboard';
export { default as PageIndicator } from './components/page-indicator';
export { default as PasscodeInput } from './components/passcode-input';
export { default as Picker } from './components/picker';
export { default as PickerView } from './components/picker-view';
export { default as Popover } from './components/popover';
export { default as Popup } from './components/popup';
export { default as ProgressBar } from './components/progress-bar';
export { default as ProgressCircle } from './components/progress-circle';
export { default as PullToRefresh } from './components/pull-to-refresh';
export { default as Radio } from './components/radio';
export { default as Rate } from './components/rate';
export { default as Result } from './components/result';
export { default as SafeArea } from './components/safe-area';
export { default as ScrollMask } from './components/scroll-mask';
export { default as SearchBar } from './components/search-bar';
export { default as Selector } from './components/selector';
export { default as SideBar } from './components/side-bar';
export { default as Skeleton } from './components/skeleton';
export { default as Slider } from './components/slider';
export { default as Space } from './components/space';
export { default as SpinLoading } from './components/spin-loading';
export { default as Stepper } from './components//stepper';
export { default as Steps } from './components/steps';
export { default as SwipeAction } from './components/swipe-action';
export { default as Swiper } from './components/swiper';
export { default as Switch } from './components/switch';
export { default as TabBar } from './components/tab-bar';
export { default as Tabs } from './components/tabs';
export { default as Tag } from './components/tag';
export { default as TextArea } from './components/text-area';
export { default as Toast } from './components/toast';
export { default as TreeSelect } from './components/tree-select';
export { default as VirtualInput } from './components/virtual-input';
export { default as WaterMark } from './components/water-mark';
</pre>
</details>

ç¬¬ä¸æ­¥ï¼å¤ç _index.js_ æä»¶ä¸­çå¯¼å¥ãå ä¸º `button` è¢«ç¨å°äºè¯å®ä¼å è½½ï¼èå¶ä»ç»ä»¶å ä¸ºæ²¡æç¨å°ä¼è¢« tree shaking æãä½æ¯è¿éå­å¨ä¸ä¸ªé®é¢ï¼æ¯ä¸ªç»ä»¶é½å¼å¥äºæ ·å¼æä»¶ï¼è css ç±»åæ¯è¢«å®ä¹æ âæå¯ä½ç¨â çï¼è¿ä¸ªæ²¡éï¼ãè¿å°±å¯¼è´ç»ä»¶ç js æä»¶è½ç¶ä¸ä¼å¯¼å¥ï¼ä½è¿ä¸ªç»ä»¶æå¼ç¨çæ ·å¼ä¼è¢«å¯¼å¥ï¼æåå°±æ¯æ´ä¸ªåºç css å¨é¨è¢«å¯¼å¥äºã

æ»æçç¥ï¼vite çæ§è½ç±ä¼ ç»ç bundle å¤çè½åè½¬åäºæµè§å¨å¤çè¯·æ±çæçï¼

1. æé«æµè§å¨çå¹¶åéï¼å¼å¯ vite ç https æå¡ã
2. æµè§å¨ç¼å­ï¼å ä¸º vite åç½®ç https æ¯èªç­¾åè¯ä¹¦éä¸è¿æµè§å¨æ£æµï¼æ¬å°ç¼å­æ¯ä¸ä¼çæçãè¿ä¸ªæ¶åå¯ä»¥ä½¿ç¨æç [vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert) æä»¶ä¸º https æä¾æ¬å°è¯ä¹¦æ¯æã
3. åå°è¯·æ±éã

åå°è¿ä¸ªé®é¢ï¼è§£å³æ¹å¼æä¸¤ä¸ªï¼

1. åå®æ¹åé¦æç»ä»¶ä¸­çæ ·å¼å¼å¥å»æï¼è¿ä¸ç°å®ï¼æä¸ªäººæè§è¿æ¯ä¸ªâåä¼åâï¼ã
2. ä¸è¦ä»åçå¥å£å»å¼ç¨ç»ä»¶ï¼æ¹ææå®æ¨¡åçå¯¼å¥ï¼

```ts
import { Button } from 'antd-mobile'

â â â â â â

import Button from 'antd-mobile/es/components/button'
```

emmï¼ååè½¬è½¬ç»äºè¿æ¯åå°äºåç¹ï¼å°±é®èå¤©é¥¶è¿è° ð

---

æä»¥è¿ä¸ªé®é¢æ¯å¯ä»¥ç¨ `babel-plugin-import` æ¥è§£å³çï¼è vite ä¸­ä¹æ [vite-plugin-importer](https://github.com/ajuner/vite-plugin-importer) å¯¹åºå°è£çæä»¶ã

ä½æ¯æè§å¾å¨ rollup ä¸­ä½¿ç¨ babel å¾ä¸ âviteâï¼ååå ~~~
