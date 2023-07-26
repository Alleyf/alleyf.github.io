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
| ---------------- | ------------ | ------------------------------------------------------------------------------------- | ------------------------ | --------------------------- | ---------------------------------------- |
| beforeCreate     | 创建前       | 实例已初始化，但数据观测，watch/event 事件回调还未配置                                | 获取不到                 | 不能                        | 不能                                     |
| created          | 创建后       | 已完成如下配置，数据观测 (data observer)，property 和方法的运算，watch/event 事件回调 | 获取不到                 | 能                          | 能                                       |
| beforeMount      | 挂载前       | dom 已初始化，但并未挂载和渲染                                                        | 能                       | 能                          | 能                                       |
| mounted          | 挂载后       | dom 已完成挂载和渲染                                                                  | 能                       | 能                          | 能                                       |
| beforeUpdate     | 更新前       | 数据已改变，但 dom 未更新                                                             | 能                       | 能                          | 能                                       |
| updated          | 更新后       | dom 已更新                                                                            | 能                       | 能                          | 能                                       |
| beforeDestroy    | 销毁前       | 实例销毁前，实例仍然可用                                                              | 能                       | 能                          | 能                                       |
| destroyed        | 销毁后       | 实例已销毁，所有指令被解绑，事件监听器被移除，子实例都被销毁                          | 能                       | 能                          | 能                                        |
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
#### 对象
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
#### 字典
```html
<div :class="{info:info,danger:danger}">我叫:{{name}},年龄:{{age}}</div>
```
```js
data: {
info: true,  
danger: false,  
},
```
#### 列表
```html
<div :class="[info,danger]">我叫:{{name}},年龄:{{age}}</div>
```
```js
info: "c1", 
danger: "c2",  
},
```
### 调用函数
> 可以在绑定的表达式中使用一个组件暴露的方法

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```
## 2. 事件监听
> 使用 `v-on` 指令监听 DOM 事件，可以简写为 `@`，表示事件监听

### 不带参数
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
### 带传参
```html
<h1 @mouseover="dosomething('过来了')" @mouseout="dosomething('离开了')">注册</h1>
```
```js
methods: {  
dosomething: function (msg){  
console.log(msg)  
}  
}
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
### 常用标签
> demo

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>VueDemo</title>  
<!-- <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.global.min.js"></script>-->  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
<style>  
.info {  
color: aquamarine;  
}  
.danger {  
color: red;  
}  
</style>  
</head>  
<body>  
<div id="app">  
<h1>注册</h1>  
<div>  
<input type="text" v-model="info.username" placeholder="用户名">  
<input type="password" v-model="info.pwd" placeholder="密码">  
</div>  
<div>  
男：<input type="radio" v-model="info.gender" value="1">  
女：<input type="radio" v-model="info.gender" value="2">  
</div>  
<div>  
篮球：<input type="checkbox" v-model="info.hobby" value="h1">  
足球：<input type="checkbox" v-model="info.hobby" value="h2">  
排球：<input type="checkbox" v-model="info.hobby" value="h3">  
</div>  
<div>  
<select v-model="info.city">  
<option value="c1">北京</option>  
<option value="c2">上海</option>  
<option value="c3">广州</option>  
<option value="c4">深圳</option>  
</select>  
</div>  
<div>  
<select v-model="info.field" multiple>  
<option value="f1">前端</option>  
<option value="f2">后端</option>  
<option value="f3">运维</option>  
<option value="f4">算法</option>  
</select>  
</div>  
<div>  
<textarea v-model="info.other"></textarea>  
</div>  
<input type="button" value="注册" @click="clickme">  
</div>  
<script>  
var app = new Vue({  
el: "#app",  
data: {  
info : {  
username: "",  
pwd: "",  
gender: "1",  
hobby: ["h1"],  
city: "c1",  
field: ["f1"],  
other: "",  
}  
},  
methods: {  
clickme: function () {  
console.log(this.info)  
}  
}  
})  
</script>  
</body>  
</html>
```

---
## 4. 条件渲染
### v-if
> 使用 `v-if` 指令来==**有条件地渲染元素**==（不一定渲染）, 也可以使用 `v-else` 和 `v-else-if` 来表示其他的条件分支

```js
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```
### v-show
> v-show 根据**==变量的真假==**决定是否显示该标签（***一定会渲染但不一定显示***）

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>VueDemo3</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
</head>  
<body>  
<div id="app">  
<div>  
<button @click="issms=false">用户名登录</button>  
<button @click="issms=true">手机号登录</button>  
</div>  
<div v-show="!issms">  
<label>用户名</label>  
<input placeholder="用户名" type="text" v-model="username">  
<label>密码</label>  
<input placeholder="密码" type="password" v-model="pwd">  
</div>  
<div v-show="issms">  
<label>手机号</label>  
<input placeholder="手机号" type="text" v-model="phone">  
<label>密码</label>  
<input placeholder="密码" type="password" v-model="pwd">  
</div>  
</div>  
<script>  
var app = new Vue({  
el: "#app",  
data: {  
issms: false,  
username: "",  
phone: "",  
pwd: "",  
},  
methods: {}  
})  
</script>  
</body>  
</html>
```
## 5. 列表渲染
> 使用 `v-for` 指令来渲染一个基于源数组的列表

### 无索引
```vue
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```
> 1. `todo` 是一个局部变量，表示当前正在迭代的数组元素。它只能在 `v-for` 所绑定的元素上或是其内部访问，就像函数的作用域一样.
> 2. key 属性将它（唯一标识主键）作为[特殊的 `key` attribute](https://cn.vuejs.org/api/built-in-special-attributes.html#key) 绑定到每个 `<li>`

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
### 有索引
```html
<ul>
  <li v-for="(todo,index) in todos" :id={{index}}>
    {{ todo }}
  </li>
</ul>
```
### 有键值
```html
<ul>
  <li v-for="(value,key) in item">
    {{ key }}:{{value}}
  </li>
</ul>
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
# 4. Demo 1表格增删 
```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>vuedemo2</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
</head>  
<body>  
<div id="app">  
<h1>用户</h1>  
<div>  
<label>用户名</label>  
<input type="text" v-model="username" placeholder="用户名">  
<label>密码</label>  
<input type="password" v-model="pwd" placeholder="密码">  
</div>  
<div>  
<input type="button" value="添加" @click="adduser">  
</div>  
<div>  
<table>  
<thead>  
<tr>  
<th>用户名</th>  
<th>密码</th>  
<th>操作</th>  
</tr>  
</thead>  
<tbody>  
<tr v-for="(user,uid) in users">  
<td>{{user.name}}</td>  
<td>{{user.pwd}}</td>  
<td><button v-if="user.name!='' && user.pwd!=''" @click="deluser(uid)">删除</button></td>  
</tr>  
</tbody>  
</table>  
</div>  
</div>  
<script>  
var app = new Vue({  
el: "#app",  
data: {  
username: "",  
pwd: "",  
users: [  
{name:"",pwd:""},  
],  
},  
methods: {  
adduser: function () {  
let userinfo = {name:this.username,pwd:this.pwd};  
this.users.push(userinfo);  
this.username="";  
this.pwd="";  
console.log(userinfo);  
},  
deluser: function (uid) {  
this.users.splice(uid,1);  
}  
}  
})  
</script>  
</body>  
</html>
```
# 5.Demo 2 登录（axios）
```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>VueDemo3</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
<script src="https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.js"></script>  
</head>  
<body>  
<div id="app">  
<div>  
<button @click="issms=false">用户名登录</button>  
<button @click="issms=true">手机号登录</button>  
</div>  
<div v-show="!issms">  
<div>  
<label>用户名</label>  
<input placeholder="用户名" type="text" v-model="info.username">  
</div>  
<div>  
<label>密码</label>  
<input placeholder="密码" type="password" v-model="info.pwd">  
</div>  
</div>  
<div v-show="issms">  
<div>  
<label>手机号</label>  
<input placeholder="手机号" type="text" v-model="sms.phone">  
</div>  
<div>  
<label>验证码</label>  
<input placeholder="验证码" type="text" v-model="sms.code">  
</div>  
</div>  
<input @click="login" type="button" value="登录">  
</div>  
<script>  
var app = new Vue({  
el: "#app",  
data: {  
issms: false,  
info: {  
username: "",  
pwd: "",  
},  
sms: {  
phone: "",  
code: "",  
},  
},  
methods: {  
login: function () {  
let dataobj = this.issms ? this.sms : this.info;  
axios({  
url: "http://localhost/login",  
method: "post",  
parameters: "",  
data: dataobj,  
headers: {  
'Content-Type': 'application/json'  
},  
}).then(function (res) {  
console.log(res);  
}).catch(function (error) {  
console.log(error);  
alert(error.message)  
})  
}  
}  
})  
</script>  
</body>  
</html>
```
# 6. 组件
> 提高相同代码的复用率。
## 局部组件
> 	局部组件需要挂载到 Vue 根组件上，***components: {  alias: component}  

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>vuedemo4</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
</head>  
<body>  
<div id="app">  
<!-- 引入局部子组件-->  
<login></login>  
</div>  
<script>  
const login = {  
data: function () {  
return {  
msg: "局部组件",  
username: "",  
pwd: "",  
}  
},  
template: `  
<div>  
<label>用户名</label>  
<input type="text" v-model="username" placeholder="用户名">  
<label>密码</label>  
<input type="password" v-model="pwd" placeholder="密码">  
</div>  
`,  
methods: {}  
};  
var app = new Vue({  
el: "#app",  
data: {},  
methods: {},  
components: {  
login: login,  
}  
})  
</script>  
</body>  
</html>
```
## 全局组件
> 	全局子组件不用挂载到 Vue 上，直接用***Vue. Component ('component_name',{}）***

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>vuedemo5</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
</head>  
<body>  
<div id="app">  
<!-- 引入全局子组件-->  
<login></login>  
</div>  
<script>  
Vue.component('login', {  
data: function () {  
return {  
msg: "局部组件",  
username: "",  
pwd: "",  
}  
},  
template: `  
<div>  
<label>用户名</label>  
<input type="text" v-model="username" placeholder="用户名">  
<label>密码</label>  
<input type="password" v-model="pwd" placeholder="密码">  
</div>  
`,  
methods: {}  
});  
var app = new Vue({  
el: "#app",  
data: {},  
methods: {},  
})  
</script>  
</body>  
</html>
```
# 7. 路由
> 引入 vue-router：
> ` <script src="https://cdn.bootcdn.net/ajax/libs/vue-router/4.1.6/vue-router.global.min.js"></script>`

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>vuedemo6</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
<script src="https://unpkg.com/vue-router@3.5.3/dist/vue-router.js"></script>  
</head>  
<body>  
<div id="app">  
<div class="menu">  
<div class="container">  
<router-link to="/">Logo</router-link>  
<router-link to="/home">首页</router-link>  
<router-link to="/course">课程</router-link>  
</div>  
</div>  
<div class="container">  
<router-view></router-view>  
</div>  
</div>  
<script>  
const Home = {  
data: function () {  
return {  
msg: "首页组件",  
}  
},  
template: `  
<h1>{{ msg }}</h1>  
`,  
methods: {}  
};  
const Course = {  
data: function () {  
return {  
msg: "课程组件",  
}  
},  
template: `  
<h1>{{ msg }}</h1>  
`,  
methods: {}  
};  
const router = new VueRouter({  
routes: [  
{path: '/', component: Home},  
{path: '/home', component: Home},  
{path: '/course', component: Course},  
],  
});  
var app = new Vue({  
el: "#app",  
data: {},  
methods: {},  
components: {  
Home: Home,  
Course: Course,  
},  
router: router  
})  
</script>  
</body>  
</html>
```
# 8.Demo 3 路由使用
```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>vuedemo6</title>  
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js"></script>  
<script src="https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.js"></script>  
<script src="https://unpkg.com/vue-router@3.5.3/dist/vue-router.js"></script>  
</head>  
<body>  
<div id="app">  
<div class="menu">  
<div class="container">  
<router-link to="/">Logo</router-link>  
<router-link to="/home">首页</router-link>  
</div>  
</div>  
<div class="container">  
<router-view></router-view>  
</div>  
</div>  
<script>  
const Home = {  
data: function () {  
return {  
imgls: [],  
}  
},  
created: function () {  
axios({  
url: "https://picsum.photos/v2/list",  
method: "get",  
headers: {  
'Content-Type': 'application/json'  
},
}).then(res => {  
this.imgls = res.data;  
console.log(this.imgls, res.data);  
}).catch((error) => {  
// console.log(error);  
alert(error.message)  
})  
},  
mounted: function () {  
console.log(this.imgls)  
},  
template: `  
<div class="red">  
<div v-for="img in imgls">  
<a :href="img.download_url">  
<img :src="img.url" style="align-content: center" alt="加载图片失败">  
</a>  
</div>  
</div>  
`,  
methods: {},  
};  
const router = new VueRouter({  
routes: [  
{path: '/', component: Home},  
{path: '/home', component: Home},  
],  
});  
var app = new Vue({  
el: "#app",  
data: {},  
methods: {},  
components: {  
Home: Home,  
},  
router: router,  
})  
</script>  
</body>  
</html>
```
# 9. Element-UI 使用
> Element 是国内饿了么公司提供的一套开源前端框架，简洁优雅，提供了 Vue、React、Angular等多个版本。
> 文档地址: [一个 Vue 3 UI 框架 | Element Plus](https://element-plus.org/zh-CN/#/zh-CN)
> 安装: npm i element-ui
> 引入 Element：
> main.js (vue 2):
```js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
Vue.use(ElementUI);
new Vue({
  el:#app,
  render: h => h(App)
);
```
main. js (vue 3):
```js
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```
## 第三方图标库
由于 Element UI 提供的字体图符较少，一般会采用其他图表库，如著名的 Font
Awesome
Font Awesome 提供了 675 个可缩放的矢量图标，可以使用 cSS 所提供的所有特
性对它们进行更改，包括大小、颜色、阴影或者其他任何支持的效果。
文档地址: http://fontawesome.dashgame.com/
安装: `npm i font-awesome`
使用: `import 'font-awesome/css/font-awesome.min.css'`
# 10.Axios 
## 1. 使用方法
> Axios 是一个基于 promise 网络请求库，作用于 node. js 和浏览器中。
> Axios 在浏览器端使用 XMLHttpRequests 发送网络请求，并能自动完成 JSON
> 数据的转换。
> 安装: npm install axios
> 地址: https://www.axios-http.cn/

1. Get 请求：

```js
//向给定ID的用户发起请求
axios.get(/user?ID=12345')
 .then(function(response){
   //处理成功情况
   console.log(response);
})
 .catch(function (error)(
   //处理错误情况
   console.log(error);
})
 .then(function （）{ 
  //总是会执行
 });

```

```js
/／上述请求也可以按以下方式完成（可选）
axios.get("/user',{
   params:{
    ID:12345
  }
})
 .then(function (response){
   console.log(response);
})
 .catch(function (error){
   console.log(error);
})
 .then(function (){ 
  //总是会执行
 });

```

2. POST 请求：

```js
axios.post('/user', {
   firstName:'Fred',
   lastName:'Flintstone'
})
 .then(function(response){
   console.log(response);
})
 .catch(function (error){
   console.log(error);
 });

```

3. 异步回调问题（async/await）：

```js
//支持async/await用法
async function getUser() (
 try (
   const response = await axios.get('/user?ID=12345');
   console.log(response)
 } catch (error){
   console.error(error);

```

4. 其他请求方式：

```js
//发起一个post请求
axios({
 method:'post',
 url:"/user/12345',
 data: {
   firstName: "Fred',
   lastName:"Flintstone'
 }
});

```

	axios.get (url, configl)
	axios.delete (url[, config])
	axios.head (uri[, config))
	axios.options (url, config])
	axios.post (url, datal, configl)
	axios.put (url, datal, config]l)
	axios.patch (url, datal, config]l)

## 2. 与 Vue 整合




## 3. 跨域

> 1. 为了保证浏览器的安全，不同源的客户端脚本在没有明确授权的情况下，不能读写对方资源，称为同源策略，同源策略是浏览器安全的基石
> 2. 同源策略 （Sameoriginpolicy）是一种约定，它是浏览器最核心也最基本的安全功能
> 3. 所谓同源 (即指在同一个域) 就是两个页面具有相同的协议（protocol），主机 (host) 和端口号  (port)
> 4. 当一个请求 url 的协议、域名、端口三者之间任意一个与当前页面 url 不同即为跨域，此时无法读取非同源网页的 Cookie，无法向非同源地址发送 AJAX 请求

解决方案：
- CORS（Cross-Origin Resource Sharing）是由 W 3 C 制定的一种跨域资源共享技术标准，其目的就是为了解决前端的跨域请求。
- CORS 可以在不破坏即有规则的情况下，通过后端服务器实现 CORS 接口，从而实现跨域通信。
- CORS 将请求分为两类：简单请求和非简单请求，分别对跨域通信提供了支持。

### 1. Spring Boot 中配置 CORS

在传统的 Java EE 开发中，可以通过过滤器统一配置，而 Spring Boot 中对此则提供了更加简洁的解决方案
**方法 1：**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer (

  @override
  public void addCorsMappings(CorsRegistry registry) (
     registry.addMapping（"/**"）//允许跨域访问的路径
      .allowedorigins（"*"）//允许跨域访问的源
.allowedMethods("POST"，"GET"，"PUT"，"OPTIONS"，"DELETE"）//允许请求方法
      .maxAge（168000）/／预检间隔时间
      .allowedHeaders（"*"）//允许头部设置
      .allowCredentials（true）；//是否发送cookie

```

**方法 2：**
给控制器类前加 CrossOrigin 注解使用默认跨域配置
<font color="#ff0000">@CrossOrigin</font>

## 4. 全局配置 Axios

> 在实际项目开发中，几乎每个组件中都会用到 axios 发起数据请求。此时会遇到如下两个问题:
> 每个组件中都需要导入 axios
> 每次发请求都需要填写完整的请求路径
> 可以通过全局配置的方式解决上述问题：

```js
//配置请求根路径
axios.defaults.baseURL = 'http://api.com'

//将 axios 作为全局的自定义属性，每个组件可以在内部直接访问 (Vue3)
app.config.globalProperties.$http = axios

//将 axios 作为全局的自定义属性，每个组件可以在内部直接访问 (Vue2)
Vue.prototype.$http = axios
```

# 11. VueRouter

## 1. 安装与使用
> - Vue 路由 vue-router 是官方的路由插件，能够轻松的管理 SPA 项目中组件的切换。
> - Vue 的单页面应用是基于路由和组件的，路由用于设定访问路径，并将路径和组件映射起来
> - vue-router 目前有 3. x 的版本和 4. x 的版本，vue-router 3. x 只能结合 vue 2进行使用，vue-router 4. x 只能结合 vue 3 进行使用
> - 安装: **npm install vue-router@4**


## 2. 参数传递

## 3. 子路由

## 4. 导航首位


