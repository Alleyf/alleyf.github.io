---
title: 初识Vue
tags: [vue]
categories: Front_end_development
date: 2023-04-16 16:29:16
sticky: 75
excerpt: it is some basic usage of vue.
---
# 1. 生命周期函数
| 生命周期钩子函数 | 实例处于阶段 | 描述                                                                                  | 能否获取到 el (this.$el) | 能否获取到 data (this. Xxx) | 能否使用 methods 中的方法 (this. Xxx ()) |
| ---------------- | ------------ | ------------------------------------------------------------------------------------- | ----------------------- | -------------------------- | -------------------------------------- |
| beforeCreate     | 创建前       | 实例已初始化，但数据观测，watch/event 事件回调还未配置                                | 获取不到                | 不能                       | 不能                                   |
| created          | 创建后       | 已完成如下配置，数据观测 (data observer)，property 和方法的运算，watch/event 事件回调 | 获取不到                | 能                         | 能                                     |
| beforeMount      | 挂载前       | dom 已初始化，但并未挂载和渲染                                                        | 能                      | 能                         | 能                                     |
| mounted          | 挂载后       | dom 已完成挂载和渲染                                                                  | 能                      | 能                         | 能                                     |
| beforeUpdate     | 更新前       | 数据已改变，但 dom 未更新                                                             | 能                      | 能                         | 能                                     |
| updated          | 更新后       | dom 已更新                                                                            | 能                      | 能                         | 能                                     |
| beforeDestroy    | 销毁前       | 实例销毁前，实例仍然可用                                                              | 能                      | 能                         | 能                                     |
| destroyed        | 销毁后       | 实例已销毁，所有指令被解绑，事件监听器被移除，子实例都被销毁                          | 能                      | 能                         | 能                                     |
|                  |              |                                                                                       |                         |                            |                                        |
|                  |              |                                                                                       |                         |                            |                                        |
# 2. API
## 声明式 API
> Vue 的核心功能是***声明式渲染***：通过扩展于标准 HTML 的模板语法，我们可以根据 JavaScript 的状态来描述 HTML 应该是什么样子的。当状态改变时，HTML 会自动更新。

我们可以使用 `data` 组件选项来声明响应式状态，该选项应该是一个返回对象的函数：
```js
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```
`message` 属性可以在模板中使用。下面展示了我们如何使用双花括号法，根据 `message` 的值来渲染动态文本：
```html
<h1>{{ message }}</h1>
```
> 在双花括号中的内容并**不只限于标识符或路径**——我们可以使用任何***有效的 JavaScript 表达式***。

```html
<h1>{{ message.split('').reverse().join('') }}</h1>
```
---
## 组合式 API
我们可以使用 Vue 的 `reactive()` API 来声明响应式状态。由 `reactive()` 创建的对象都是 JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行为与普通对象一样：
```js
import { reactive } from 'vue'
const counter = reactive({
  count: 0
})
console.log(counter.count) // 0
counter.count++
```
> [!NOTE] Tips
> `reactive()` 只适用于对象 (包括数组和内置类型，如 `Map` 和 `Set`)。而另一个 API `ref()` 则可以接受任何值类型。`ref` 会返回一个包裹对象，并在 `.value` 属性下暴露内部值。

```js
import { ref } from 'vue'
const message = ref('Hello World!')
console.log(message.value) // "Hello World!"
message.value = 'Changed'
```
> 在组件的 `<script setup>` 块中声明的响应式状态，可以直接在模板中使用
```html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```
> 使用任何***有效的 JavaScript 表达式***
```html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

---

# 3. 基础语法
## 1. 属性绑定
> 双大括号只能进行文本插值，为了给 attribute 绑定一个动态值，需要使用 `v-bind` 指令, 可以缩写只用 `:` 表示属性绑定

```html
<div v-bind:id="dynamicId"></div>
<div :id="dynamicId"></div>
```

### 动态绑定多个属性

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```

> 通过不带参数的 `v-bind`，你可以将它们绑定到单个元素上
```html
<div v-bind="objectOfAttrs"></div>
```


### 多属性



### 调用函数

> 可以在绑定的表达式中使用一个组件暴露的方法

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```


## 2. 事件监听
> 使用 `v-on` 指令监听 DOM 事件，可以简写为 `@`，表示事件监听

```html
<button v-on:click="increment">{{ count }}</button>
<button @click="increment">{{ count }}</button>
```
```js
<script setup>
import { ref } from 'vue'
const count = ref(0)
function increment() {
  // 更新组件状态
  count.value++
}
</script>
```
## 3. 表单绑定
> 同时使用 `v-bind` 和 `v-on` 来在表单的输入元素上创建双向绑定

```html
<input :value="text" @input="onInput">
```
```js
function onInput(e) {
  // v-on 处理函数会接收原生 DOM 事件
  // 作为其参数。
  text.value = e.target.value
}
```
> 简化双向绑定，Vue 提供了一个 `v-model` 指令，它实际上是上述操作的语法糖

```html
<input v-model="text">
```
> [!NOTE] Tips
> 1. `v-model` 会将被绑定的值与 `<input>` 的值自动同步
> 2. `v-model` 不仅支持文本输入框，也支持诸如多选框、单选框、下拉框之类的输入类型

**完整 demo**
```vue
<script setup>
import { ref } from 'vue'
const text = ref('')
</script>
<template>
  <input v-model="text" placeholder="Type here">
  <p>{{ text }}</p>
</template>
```
## 4. 条件渲染
> 使用 `v-if` 指令来有条件地渲染元素, 也可以使用 `v-else` 和 `v-else-if` 来表示其他的条件分支

```js
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```
## 5. 列表渲染
> 使用 `v-for` 指令来渲染一个基于源数组的列表

```vue
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```
> 1. `todo` 是一个局部变量，表示当前正在迭代的数组元素。它只能在 `v-for` 所绑定的元素上或是其内部访问，就像函数的作用域一样.
> 2. 并且将它作为[特殊的 `key` attribute](https://cn.vuejs.org/api/built-in-special-attributes.html#key) 绑定到每个 `<li>`

> 更新列表有两种方式：
	1. 在源数组上调用变更方法：
		`todos.value.push(newTodo)`
      2. 使用新的数组替代原数组：
		`todos.value = todos.value.filter(/* ... */)` 

完整 demo（实现列表动态增删）
```vue
<script setup>
import { ref } from 'vue'

// 给每个 todo 对象一个唯一的 id
let id = 0

const newTodo = ref('')
const todos = ref([
  { id: id++, text: 'Learn HTML' },
  { id: id++, text: 'Learn JavaScript' },
  { id: id++, text: 'Learn Vue' }
])

function addTodo() {
  // ...
  todos.value.push({id:id++,text:newTodo.value})
  newTodo.value = ''
}

function removeTodo(todo) {
  // 方法1
  todos.value.pop(todo)
  // 方法2
  todos.value = todos.value.filter((t) => t !== todo)
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo">
    <button>Add Todo</button>    
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>
```

## 6. 计算属性

> 1. [`computed()`](https://cn.vuejs.org/guide/essentials/computed.html)。它可以让我们创建一个计算属性 ref，这个 ref 会动态地根据其他响应式数据源来计算其 `.value`
> 2. computed`(计算属性)`可用于快速计算视图（View）中显示的属性。这些计算将被**缓存**，并且只在需要时更新。computed设置的初衷是能够**解决复杂的计算**，而不是直接在模板字符串里进行运算。

实现显示（隐藏）已完成的todos
```vue
<script setup>
import { ref, computed } from 'vue'

let id = 0

const newTodo = ref('')
const hideCompleted = ref(false)
const todos = ref([
  { id: id++, text: 'Learn HTML', done: true },
  { id: id++, text: 'Learn JavaScript', done: true },
  { id: id++, text: 'Learn Vue', done: false }
])

const filteredTodos = computed(() => {
  return hideCompleted.value
    ? todos.value.filter((t) => !t.done)
    : todos.value
})

function addTodo() {
  todos.value.push({ id: id++, text: newTodo.value, done: false })
  newTodo.value = ''
}

function removeTodo(todo) {
  todos.value = todos.value.filter((t) => t !== todo)
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo">
    <button>Add Todo</button>
  </form>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
      <input type="checkbox" v-model="todo.done">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
  <button @click="hideCompleted = !hideCompleted">
    {{ hideCompleted ? 'Show all' : 'Hide completed' }}
  </button>
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>
```

## 7. 文本插值

> 最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)

```html
<span>Message: {{ msg }}</span>
```

> 双大括号标签会被替换为[相应组件实例中](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#declaring-reactive-state) `msg` 属性的值。同时每次 `msg` 属性更改时它也会同步更新。

## 8.原始 HTML

> 双大括号会将数据解释为纯文本，而不是 HTML。若想插入 HTML，需要使用 [`v-html` 指令](https://cn.vuejs.org/api/built-in-directives.html#v-html)

```html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

