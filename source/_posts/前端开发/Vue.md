---
title: 初识Vue
tags:
  - vue
categories: Front_end_development
date: 2023-04-16 16:29:16
sticky: 75
excerpt: it is some basic usage of vue.
---
# 1 生命周期函数
| 生命周期钩子函数 | 实例处于阶段 | 描述                                                                                  | 能否获取到 el (this.$el) | 能否获取到 data (this. Xxx) | 能否使用 methods 中的方法 (this. Xxx ()) |
| ---------------- | ------------ | ------------------------------------------------------------------------------------- | ------------------------ | --------------------------- | ---------------------------------------- |
| beforeCreate     | 创建前       | 实例已初始化,但数据观测,watch/event 事件回调还未配置                                | 获取不到                 | 不能                        | 不能                                     |
| created          | 创建后       | 已完成如下配置,数据观测 (data observer),property 和方法的运算,watch/event 事件回调 | 获取不到                 | 能                          | 能                                       |
| beforeMount      | 挂载前       | dom 已初始化,但并未挂载和渲染                                                        | 能                       | 能                          | 能                                       |
| mounted          | 挂载后       | dom 已完成挂载和渲染                                                                  | 能                       | 能                          | 能                                       |
| beforeUpdate     | 更新前       | 数据已改变,但 dom 未更新                                                             | 能                       | 能                          | 能                                       |
| updated          | 更新后       | dom 已更新                                                                            | 能                       | 能                          | 能                                       |
| beforeDestroy    | 销毁前       | 实例销毁前,实例仍然可用                                                              | 能                       | 能                          | 能                                       |
| destroyed        | 销毁后       | 实例已销毁,所有指令被解绑,事件监听器被移除,子实例都被销毁                          | 能                       | 能                          | 能                                        |
# 2 API
## 2.1 声明式 API
> Vue 的核心功能是***声明式渲染***:通过扩展于标准 HTML 的模板语法,我们可以根据 JavaScript 的状态来描述 HTML 应该是什么样子的。当状态改变时,HTML 会自动更新。

我们可以使用 `data` 组件选项来声明响应式状态,该选项应该是一个返回对象的函数:
```js
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```
`message` 属性可以在模板中使用。下面展示了我们如何使用双花括号法,根据 `message` 的值来渲染动态文本:
```html
<h1>{{ message }}</h1>
```
> 在双花括号中的内容并**不只限于标识符或路径**——我们可以使用任何***有效的 JavaScript 表达式***。

```html
<h1>{{ message.split('').reverse().join('') }}</h1>
```
---
## 2.2 组合式 API
我们可以使用 Vue 的 `reactive()` API 来声明响应式状态。由 `reactive()` 创建的对象都是 JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),其行为与普通对象一样:
```js
import { reactive } from 'vue'
const counter = reactive({
  count: 0
})
console.log(counter.count) // 0
counter.count++
```
> [!NOTE] Tips
> `reactive()` 只适用于对象 (包括数组和内置类型,如 `Map` 和 `Set`)。而另一个 API `ref()` 则可以接受任何值类型。`ref` 会返回一个包裹对象,并在 `.value` 属性下暴露内部值。

```js
import { ref } from 'vue'
const message = ref('Hello World!')
console.log(message.value) // "Hello World!"
message.value = 'Changed'
```
> 在组件的 `<script setup>` 块中声明的响应式状态,可以直接在模板中使用
```html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```
> 使用任何***有效的 JavaScript 表达式***
```html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

---
# 3 基础语法
## 3.1 属性绑定
> 双大括号只能进行文本插值,为了给 attribute 绑定一个动态值,需要使用 `v-bind` 指令, 可以缩写只用 `:` 表示属性绑定

```html
<div v-bind:id="dynamicId"></div>
<div :id="dynamicId"></div>
```
### 3.1.1 动态绑定多个属性
#### 3.1.1.1 对象
```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```
> 通过不带参数的 `v-bind`,你可以将它们绑定到单个元素上
```html
<div v-bind="objectOfAttrs"></div>
```
#### 3.1.1.2 字典
```html
<div :class="{info:info,danger:danger}">我叫:{{name}},年龄:{{age}}</div>
```
```js
data: {
info: true,  
danger: false,  
},
```
#### 3.1.1.3 列表
```html
<div :class="[info,danger]">我叫:{{name}},年龄:{{age}}</div>
```
```js
info: "c1", 
danger: "c2",  
},
```
### 3.1.2 调用函数
> 可以在绑定的表达式中使用一个组件暴露的方法

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```
## 3.2 事件监听
> 使用 `v-on` 指令监听 DOM 事件,可以简写为 `@`,表示事件监听

### 3.2.1 不带参数
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
### 3.2.2 带传参
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
## 3.3 表单绑定
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
> 简化双向绑定,Vue 提供了一个 `v-model` 指令,它实际上是上述操作的语法糖

```html
<input v-model="text">
```
> [!NOTE] Tips
> 1. `v-model` 会将被绑定的值与 `<input>` 的值自动同步
> 2. `v-model` 不仅支持文本输入框,也支持诸如多选框、单选框、下拉框之类的输入类型

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
### 3.3.1 常用标签
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
男:<input type="radio" v-model="info.gender" value="1">  
女:<input type="radio" v-model="info.gender" value="2">  
</div>  
<div>  
篮球:<input type="checkbox" v-model="info.hobby" value="h1">  
足球:<input type="checkbox" v-model="info.hobby" value="h2">  
排球:<input type="checkbox" v-model="info.hobby" value="h3">  
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
## 3.4 条件渲染
### 3.4.1 v-if
> 使用 `v-if` 指令来==**有条件地渲染元素**==（不一定渲染）, 也可以使用 `v-else` 和 `v-else-if` 来表示其他的条件分支

```js
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```
### 3.4.2 v-show
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
## 3.5 列表渲染
> 使用 `v-for` 指令来渲染一个基于源数组的列表

### 3.5.1 无索引
```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```
> 1. `todo` 是一个局部变量,表示当前正在迭代的数组元素。它只能在 `v-for` 所绑定的元素上或是其内部访问,就像函数的作用域一样.
> 2. key 属性将它（唯一标识主键）作为[特殊的 `key` attribute](https://cn.vuejs.org/api/built-in-special-attributes.html#key) 绑定到每个 `<li>`

> 更新列表有两种方式:
	1. 在源数组上调用变更方法:
		`todos.value.push(newTodo)`
      2. 使用新的数组替代原数组:
		`todos.value = todos.value.filter(/* ... */)` 

完整 demo（实现列表动态增删）
```html
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
### 3.5.2 有索引
```html
<ul>
  <li v-for="(todo,index) in todos" :id={{index}}>
    {{ todo }}
  </li>
</ul>
```
### 3.5.3 有键值
```html
<ul>
  <li v-for="(value,key) in item">
    {{ key }}:{{value}}
  </li>
</ul>
```
## 3.6 计算属性
> 1. [`computed()`](https://cn.vuejs.org/guide/essentials/computed.html)。它可以让我们创建一个计算属性 ref,这个 ref 会动态地根据其他响应式数据源来计算其 `.value`
> 2. computed `(计算属性)` 可用于快速计算视图（View）中显示的属性。这些计算将被**缓存**,并且只在需要时更新。computed 设置的初衷是能够**解决复杂的计算**,而不是直接在模板字符串里进行运算。

实现显示（隐藏）已完成的 todos
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
## 3.7 文本插值
> 最基本的数据绑定形式是文本插值,它使用的是“Mustache”语法 (即双大括号)

```html
<span>Message: {{ msg }}</span>
```
> 双大括号标签会被替换为[相应组件实例中](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#declaring-reactive-state) `msg` 属性的值。同时每次 `msg` 属性更改时它也会同步更新。

## 3.8 原始 HTML
> 双大括号会将数据解释为纯文本,而不是 HTML。若想插入 HTML,需要使用 [`v-html` 指令](https://cn.vuejs.org/api/built-in-directives.html#v-html)

```html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```
# 4 Demo 1 表格增删 
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
# 5 Demo 2 登录（axios）
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
# 6 组件
> 提高相同代码的复用率。
## 6.1 局部组件
> 	局部组件需要挂载到 Vue 根组件上,***components: {  alias: component}  

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
## 6.2 全局组件
> 	全局子组件不用挂载到 Vue 上,直接用***Vue. Component ('component_name',{}）***

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
# 7 路由
> 引入 vue-router:
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
# 8 路由使用
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
# 9 Element-UI 使用
> Element 是国内饿了么公司提供的一套开源前端框架,简洁优雅,提供了 Vue、React、Angular 等多个版本。
> 文档地址: [一个 Vue 3 UI 框架 | Element Plus](https://element-plus.org/zh-CN/#/zh-CN)
> 安装: npm i element-ui
> 引入 Element:
> main. js (vue 2):
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
## 9.1 第三方图标库
由于 Element UI 提供的字体图符较少,一般会采用其他图表库,如著名的 Font
Awesome
Font Awesome 提供了 675 个可缩放的矢量图标,可以使用 cSS 所提供的所有特
性对它们进行更改,包括大小、颜色、阴影或者其他任何支持的效果。
文档地址: http://fontawesome.dashgame.com/
安装: `npm i font-awesome`
使用: `import 'font-awesome/css/font-awesome.min.css'`
# 10 Axios 
## 10.1 使用方法
> Axios 是一个基于 promise 网络请求库,作用于 node. js 和浏览器中。
> Axios 在浏览器端使用 XMLHttpRequests 发送网络请求,并能自动完成 JSON
> 数据的转换。
> 安装: npm install axios
> 地址: https://www.axios-http.cn/

1. Get 请求:

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
2. POST 请求:

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
3. 异步回调问题（async/await）:

```js
//支持async/await用法
async function getUser() (
 try (
   const response = await axios.get('/user?ID=12345');
   console.log(response)
 } catch (error){
   console.error(error);
```
4. 其他请求方式:

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
## 10.2 与 Vue 整合
## 10.3 跨域
> 1. 为了保证浏览器的安全,不同源的客户端脚本在没有明确授权的情况下,不能读写对方资源,称为同源策略,同源策略是浏览器安全的基石
> 2. 同源策略 （Sameoriginpolicy）是一种约定,它是浏览器最核心也最基本的安全功能
> 3. 所谓同源 (即指在同一个域) 就是两个页面具有相同的协议（protocol）,主机 (host) 和端口号  (port)
> 4. 当一个请求 url 的协议、域名、端口三者之间任意一个与当前页面 url 不同即为跨域,此时无法读取非同源网页的 Cookie,无法向非同源地址发送 AJAX 请求

解决方案:
- CORS（Cross-Origin Resource Sharing）是由 W 3 C 制定的一种跨域资源共享技术标准,其目的就是为了解决前端的跨域请求。
- CORS 可以在不破坏即有规则的情况下,通过后端服务器实现 CORS 接口,从而实现跨域通信。
- CORS 将请求分为两类:简单请求和非简单请求,分别对跨域通信提供了支持。

### 10.3.1 Spring Boot 中配置 CORS
在传统的 Java EE 开发中,可以通过过滤器统一配置,而 Spring Boot 中对此则提供了更加简洁的解决方案
**方法 1:**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer (
  @override
  public void addCorsMappings(CorsRegistry registry) (
     registry.addMapping（"/**"）//允许跨域访问的路径
      .allowedorigins（"*"）//允许跨域访问的源
.allowedMethods("POST","GET","PUT","OPTIONS","DELETE"）//允许请求方法
      .maxAge（168000）/／预检间隔时间
      .allowedHeaders（"*"）//允许头部设置
      .allowCredentials（true）；//是否发送cookie
```
**方法 2:**
给控制器类前加 CrossOrigin 注解使用默认跨域配置
<font color="#ff0000">@CrossOrigin</font>
## 10.4 全局配置 Axios
> 在实际项目开发中,几乎每个组件中都会用到 axios 发起数据请求。此时会遇到如下两个问题:
> 每个组件中都需要导入 axios
> 每次发请求都需要填写完整的请求路径
> 可以通过全局配置的方式解决上述问题:

```js
//配置请求根路径
axios.defaults.baseURL = 'http://api.com'
//将 axios 作为全局的自定义属性,每个组件可以在内部直接访问 (Vue3)
app.config.globalProperties.$http = axios
//将 axios 作为全局的自定义属性,每个组件可以在内部直接访问 (Vue2)
Vue.prototype.$http = axios
```
---
# 11 VueRouter
## 11.1 安装与使用
> - Vue 路由 vue-router 是官方的路由插件,能够轻松的管理 SPA 项目中组件的切换。
> - Vue 的单页面应用是基于路由和组件的,路由用于设定访问路径,并将路径和组件映射起来
> - vue-router 目前有 3. x 的版本和 4. x 的版本,vue-router 3. x 只能结合 vue 2 进行使用,vue-router 4. x 只能结合 vue 3 进行使用
> - 安装: **npm install vue-router@4 **

### 11.1.1 创建路由组件
在项目中定义 Discover. vue、Friends. vue、MyMusic. vue 三个组件,将来要使用 vue-router 来控制它们的展示与切换:
Discover. vue:
```js
<template>  
<div>  
<h1>发现音乐</h1>  
</div>  
</template>  
<script>  
export default {  
name: "Discover"  
}  
</script>  
<style scoped>  
</style>
```
 <template>
     <div>
        <h1>发现音乐</h1>
     </div>
 </template>
Friends. vue :
```js
<template>  
<div>  
<h1>关注</h1>  
</div>  
</template>  
<script>  
export default {  
name: "Friends"  
}  
</script>  
<style scoped>  
</style>
```
 <template>
     <div>
         <h1>关注</h1>
     </div>
 </template>
MyMusic. vue:
```js
<template>  
<div>  
<h1>我的音乐</h1>  
</div>  
</template>  
<script>  
export default {  
name: "MyMusic"  
}  
</script>  
<style scoped>  
</style>
```
---
### 声明路由链接和占位标签
> 可以使用 `<router-link>` 标签来声明路由链接,并使用 `<router-view>` 标签来声明路由占位符。示例代码如下:

App. vue:
```js
 <template>
   <div>
    <h1>APP 组件</h1>
     <!--声明路由链接-->
     <router-link to="/discover">发现音乐</router-link>
     <router-link to="/mymusic">我的音乐</router-link>
     <router-link to="/friend">关注</router-link>
    <!--声明路由占位标签-->
     <router-view></router-view>
  </div>
 </template>
```
### 11.1.2 创建路由模块
在项目中创建 index. js 路由模块,加入以下代码:
vue 2 路由的使用
```js
import VueRouter from 'vue-router'
import vue from 'vue'
import Discover from '@/components/Discover. vue'
import Friends from '@/components/Friends. vue'
import MyMusic from '@/components/MyMusic. vue'
//将 VueRouter 设置为 Vue 的插件
Vue. use (VueRouter)
const router = new VueRouter ({
     / /指定 hash 属性与组件的对应关系
     routes: [
       { path: '/discover', component: Discover },
       { path: '/friends', component: Friends },
       { path: "/mymusic', component: MyMusic},
    ]
})
export default router
```
vue 3 路由的使用
```js
import { createRouter, createWebHistory } from 'vue-router'  
import HomeView from '../views/HomeView. vue'  
const router = createRouter ({  
history: createWebHistory (import. meta. env. BASE_URL),  
routes: [  
{  
path: '/',  
name: 'home',  
component: HomeView  
},  
{  
path: '/about',  
name: 'about',  
// route level code-splitting  
// this generates a separate chunk (About.[hash]. js) for this route  
// which is lazy-loaded when the route is visited.  
component: () => import ('../views/AboutView. vue')  
}  
]  
})  
export default router
```
---
### 11.1.3 挂载路由模块
在 main. js 中导入并挂载 router
```js
import Vue from 'vue'
import App from './App. vue'
import router from './router'
Vue. config. productionTip = false
new Vue ({
render: h => h (App),
router
}).$mount (' #app ')
```
### 11.1.4 路由重定向
> 路由重定向指的是:用户在访问地址 A 的时候,强制用户跳转到地址 C,从而展示特定的组件页面。
> 
> 通过路由规则的 redirect 属性,指定一个新的路由地址,可以很方便地设置路由的重定向:
```js
 const router = new VueRouter (t
    / /指定 hash 属性与组件的对应关系
    routes: [
       //当用户访问／时,跳转到/discover
      {path: '/, redirect: '/discover',
      {path: '/discover', component: Discover},
      {path: '/friends', component: Friends},
      {path: '/my', component: MyMusic}
   ]
})
```
---
## 11.2 子路由
### 11.2.1 嵌套路由
> 在 Discover. vue 组件中,声明 toplist 和 playlist 的子路由链接以及子路由占位符。示例代码如下:
```js
 <template>
    <div>
        <h1>发现音乐</h1>
        <!--子路由链接-->
        <router-link to="/discover/toplist">推荐</router-link>
        <router-link to="/discover/playlist">歌单</router-link>
       <hr>
        <router-view></router-view>
    </div>
 </template>
```
> [!NOTE] Tips
> 在 `src/router/index. js` 路由模块中,导入需要的组件,并使用 children 属性声明子路由规则:
> 
```js
const router = new VueRouter (t
     / /指定 hash 属性与组件的对应关系
     routes:[
       { path: "/', redirect: "/discover'},
       {
           path: '/discover',
           component: Discover,
           //通过 chi 1 dren 属性,嵌套声明子路由
           chiidren: [
               { path: "toplist", component: TopList },
               { path: "playlist", component: PlayList },
          ]
       },
		{ path: '/friends', component: Friends },
		{ path: '/mymusic', component: MyMusic },
   1
3)
```
### 11.2.2 动态路由
思考:有如下 3 个路由链接:
```js
 <router-link to="/product/1">商品 1</router-link>
 <router-link to="/product/2">商品 2</router-link>
 <router-link to="/product/3">商品 3</router-link>
 const router = new VueRouter (t
    / /指定 hash 属性与组件的对应关系
    routes: [
       path: '/product/1', component: Product,
       path: '/product/2', component: Product,
       path: '/product/3', component: Product,
   ]
})
```
> 上述方式复用性非常差。
> 动态路由指的是:把 Hash 地址中可变的部分定义为参数项,从而提高路由规则的复用性。在 vue-router 中使用英文的冒号（:）来定义路由的参数项。示例代码如下:
> `{path: "/product/: id', component: Product}`
> 通过动态路由匹配的方式染出来的组件中,可以使用 `$route. params` 对象访问到动态匹配的参数值,比如在商品详情组件的内部,**根据 id 值,请求不同的商品数据**。
```js
 <template>
    <h1>Product 组件</h1>
    ！--获取动态的 id 值-->
    <p>($route. params. id)</p>
 </template>
<script>
 export default t
//组件的名称
  name: 'Product'
</script>
```
> 为了简化路由参数的获取形式,vue-router 允许在路由规则中开启 **props** 传参。示例代码如下: `{ path:/: id', component: Product, props: true}`
```js
<template>
   <h1>Product 组件</h1>
   <!--获取动态的id值-->
   <p> {{id}} </p>
</template>
<script>
export default {
//组件的名称
 name: 'Product',
 props : ["id"]
}
</script>
```
---
### 11.2.3 编程式导航
|           声明式           |        编程式        |
|:--------------------------:|:--------------------:|
| `<router-link :to="..." >` | `router. push (...)` |
> - 除了使用 `<router-link>` 创建 a 标签来定义导航链接,我们还可以借助 router 的实例方法,通过编写代码来实现。
> 
> - 想要导航到不同的 URL,则使用 `router. push` 方法。这个方法会向 history 栈添加一个新的记录,所以,当用户点击浏览器后退按钮时,则回到之前的 URL。
> 
> - 当你点击 `<router-link>` 时,这个方法会在内部调用,所以说,点击<router-link:to="...">等同于调用 router. push（...）。
```js
 <template>
    <button@click="gotoProduct(2)">跳转到商品 2</button>
 </template>
 <script>
 export default {
    methods : {
	       gotoProduct: function (id){
	          this.$router. push ('/production/${id}')
	          }
      }
}
 </script>
```
---
## 11.3 导航守卫
> 导航守卫可以控制路由的访问权限。示意图如下:
> 全局导航守卫会拦截每个路由规则,从而对每个路由进行访问权限的控制。
> 你可以使用 `router. beforeEach` 注册一个全局前置守卫:
```js
router. beforeEach ((to, from, next) =>{
   if (to. path ==='/main' && ! isAuthenticated) {
      next ('/login')
   }
   else {
      next ()
   }
})
```
 - to:即将要进入的目标
 - from:当前导航正要离开的路由
 - 在守卫方法中如果声明了 next 形参,则必须调用 next () 函数,否则不允许用户访问任何一个路由！
   1. 直接放行:`next ()`
   2. 强制其停留在当前页面:`next (false)`
   3. 强制其跳转到登录页面:`next ('/login')`

# 12 VueX
## 12.1 VueX 介绍
> 对于组件化开发来说,大型应用的状态往往跨越多个组件。在多层嵌套的父子
> 组件之间传递状态已经十分麻烦,而 Vue 更是没有为兄弟组件提供直接共享数
> 据的办法。
> 
> 基于这个问题,许多框架提供了解决方案使用全局的状态管理器,将所有
> 分散的共享数据交由状态管理器保管,Vue 也不例外。
> 
> Vuex 是一个专为 Vuejs 应用程序开发的状态管理库,采用集中式存储管理应
> 用的所有组件的状态。
> 
> 简单的说,Vuex 用于管理分散在 Vue 各个组件中的数据。
> 
> 安装: `npm install vuex@next`

### 12.1.1 状态管理
> 每一个 Vuex 应用的核心都是一个 store,与普通的全局对象不同的是,基于 Vue 数据与视图绑定的特点,当 store 中的状态发生变化时,与之绑定的视图也会被重新渲染。

> store 中的状态不允许被直接修改,改变 store 中的状态的唯一途径就是显式地提交 (commit）mutation,这可以让我们方便地跟踪每一个状态的变化。
> 
> 在大型复杂应用中,如果无法有效地跟踪到状态的变化,将会对理解和维护代> 码带来极大的困扰。
> 
> Vuex 中有 5 个重要的概念:**State、Getter、Mutation、Action、Module**。

![image.png|400](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202307272110993.png)
### 12.1.2 State
> State 用于维护所有应用层的状态,并确保应用只有唯一的数据源

```js
import {createStore} from 'vuex'
//创建一个新的 store 实例
const store = createstore ({
  state () {
   return  {
    count: 0
   }
 },
  mutations: {
   increment (state) {
    state.count++
   }
 }
})
export default store
```
> 在组件中,可以直接使用 `this.$store.state.count` 访问数据,也可以先用 **mapState** 辅助函数将其映射下来

```js
//在单独构建的版本中辅助函数为 Vuex.mapstate
import { mapState } from 'vuex'
export default {
 // ...
 computed: mapState ({
  //箭头函数可使代码更简练
   count: state => state.count,
  //传字符串参数‘count'等同于‘state => state. count'
  countAlias: 'count',
   //为了能够使用‘this＇获取局部状态,必须使用常规函数
   countplusLocalState (state) {
    return state.count + this.localcount
	    }
	})
}
```
### 12.1.3 Mutation
> Mutation 提供修改 State 状态的方法。

```js
 //创建一个新的 store 实例
 const store = createstore ({
  state return { 
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
		}
	}
})
```
> 在组件中,可以直接使用 store.commit 来提交 mutation

```js
methods: {
  increment () {
   this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```
> 也可以先用 mapMutation 辅助函数将其映射下来

```js
 methods: {
   ...mapMutations ([
    'increment', //将‘this.increment ()'映射为‘this.$store.commit ('increment'）
    //‘mapMutations＇也支持载荷:
    'incrementBy'//将‘this.incrementBy(amount)’映射为‘this.$store.commit('increment', amount)
]),
```
### 12.1.4 Action
> Action 类似 Mutation,不同在于:

> Action 不能直接修改状态,只能通过提交 mutation 来修改,**Action 可以包含异步操作**

```js
const store = createstore ({
 state: {
  count: 0
},
 mutations: {
  increment (state) {
    state. count++
  }
},
 actions: {
  increment (context) 
    context.commit('increment')
		}
	}
 })
```
> 在组件中,可以直接使用 `this.$store.dispatch (xxx')` 分发 action,或者使用 `mapActions` 辅助函数先将其映射下来

```js
// ...
methods : {
  ...mapActions([
   'increment',//将‘this.increment ()映射为‘this.$store.dispatch ('increment')
   //mapActions＇也支持载荷:
   'incrementBy'//将‘this.incrementBy (amount)’映射为'this.$store.dispatch ('incrementBy',amount)'
 ]),
```
### 12.1.5 Getter
> Getter 维护由 State 派生的一些状态,这些状态随着 State 状态的变化而变化

```js
const store = createstore ({
  state: {
    todos:[
     { id: 1, text: '...', done: true },
     { id: 2, text: '...', done: false }
   ]
  },
  getters: {
    doneTodos: (state) => {
     return state.todos.filter(todo => todo.done)
     }
  }
})
```
> 在组件中,可以直接使用 `this.$store.getters.doneTodos`,也可以先用 `mapGetters` 辅助函数将其映射下来,代码如下:

```js
import { mapGetters } from 'vuex'
export default {
 // ...
 computed: {
  //使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters ([
     'doneTodosCount'
     "anotherGetter',
    // ...
	  ])
	}
}
```
#### 12.1.5.1 通过属性访问
> Getter 会暴露为 `store.getters` 对象,你可以以属性的形式访问这些值:

```js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```
> Getter 也可以接受其他 getter 作为第二个参数:

```js
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}
```
```js
store.getters.doneTodosCount // -> 1
```
> 我们可以很容易地在任何组件中使用它:

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```
> 注意,getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

#### 12.1.5.2 通过方法访问
> 你也可以通过让 getter 返回一个函数,来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

 ```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```
```js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```
> 注意,getter 在通过方法访问时,每次都会去进行调用,而不会缓存结果。

#### 12.1.5.3 `mapGetters` 辅助函数
`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性:
```js
import { mapGetters } from 'vuex'
export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```
> 如果你想将一个 getter 属性另取一个名字,使用对象形式:

```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
---
## 12.2 Vuex 安装与使用
> 当一个组件需要获取多个状态的时候,将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题,我们可以使用 `mapState` 辅助函数帮助我们生成计算属性,让你少按几次键:

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'
export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    // 为了能够使用 `this` 获取局部状态,必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```
> 当映射的计算属性的名称与 state 的子节点名称相同时,我们也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```
---
**eg:**
```js
<template>  
<div>  
<h1>我的音乐</h1>  
<router-link :to="murl">音乐{{ mid }}</router-link>  
<router-link :to="nmurl">音乐{{ mid + 1 }}</router-link>  
<div>  
<router-view></router-view>  
</div>  
<button @click="nextMusic">下一首</button>  
</div>  
</template>  
<script>  
import {mapState} from "vuex";  
export default {  
name: "MyMusic",  
// computed: {  
// getMid() {  
// return this.$store.state.mid  
// }  
// },  
computed: mapState([  
'mid',  
]),  
data() {  
return {  
murl: "/mymusic/0",  
nmurl: "/mymusic/1",  
}  
},  
methods: {  
nextMusic() {  
this.$store.commit('increment')  
this.murl = "/mymusic/" + this.mid  
this.nmurl = "/mymusic/" + (this.mid + 1)  
console.log(this.$store.state.mid)  
}  
}  
}  
</script>  
<style scoped>  
</style>
```
**getter—eg:**
```js
import {createStore} from 'vuex'  
// 创建一个新的 store 实例  
const store = createStore({  
state: {  
mid: 0,  
todos: [  
{id: 1, text: '学习', done: true},  
{id: 2, text: '吃饭', done: true},  
{id: 3, text: '睡觉', done: false}  
]  
},  
getters: {  
doneTodos(state) {  
return state.todos.filter(todo => todo.done)  
},  
doneTodosCount(state, getters) {  
return getters.doneTodos.length  
},  
getTodoById: (state) => (id) => {  
return state.todos.find(todo => todo.id === id)  
}  
},  
mutations: {  
increment(state) {  
state.mid++  
}  
}  
})  
export default store
```
# 13 MockJS
## 13.1 MockJs 介绍
> Mock.js 是一款前端开发中**拦截 Ajax 请求再生成随机数据响应**的工具,可以用来模拟服务器响应
> 
> 优点是非常简单方便,无侵入性,基本覆盖常用的接口数据类型.
> 
> 支持生成随机的==文本、数字、布尔值、日期、邮箱、链接、图片、颜色==等。
> 安装: `npm install mockjs`

## 13.2 MockJs 使用
> 在项目中创建 mock 目录,新建 index.js 文件

```js
//引入 mockjs
import Mock from 'mockjs'
//使用 mockjs 模拟数据
Mock.mock ('/product/search', {
    "ret": 0,
    "data":
	{
       "mtime": "@datetime",//随机生成日期时间
       "score|1-800": 800,//随机生成1-800的数字
       "rank|1-100":  100,//随机生成1-100的数字
       "stars|1-5": 5,//随机生成1-5的数字
       "nickname": "@cname",//随机生成中文名字
       //生成图片
		"img":"@image('200x100','#ffcc33', '#FFF','png','Fast Mock')"
    }
});
```
> 在 main. js 中导入 mock 下的 index.js
```js
import {createApp} from 'vue'  
import App from './App.vue'  
import router from './router'  
import store from './store'  
import './mock'  
import './assets/main.css'  
const app = createApp(App)  
app.use(router)  
app.use(store)  
app.mount('#app')
```
> 组件中调用 **mock. js** 中模拟的数据接口,这时返回的 response 就是 mock.js 中用==Mock.mock ('url', data)中设置的 data==

```js
import axios from 'axios'
export default {
  mounted: function (){
	axios.get("/prduct/search").then(res => {
		console.log(res)
   })
   }
}
```
## 13.3 核心方法
`Mock.mock(rurl?, rtype?, template|function ( options ) )`
>  rurl,表示需要拦截的 URL,可以是 **URL 字符串或 URL 正则**
>  rtype,表示需要拦截的 **Ajax 请求类型**。例如 GET、POST、PUT、DELETE 等。
>  template,表示数据模板,可以是**对象或字符串**
>  function,表示用于**生成响应数据的函数**。

> 设置延时请求到数据

```js
  //延时 400 ms 请求到数据
  Mock.setup ({
    timeout: 400
 })
  //延时 200-600 毫秒请求到数据
  Mock.setup ({
    timeout: '200-600'
 })
```
## 13.4 数据生成规则
> - mock 的语法规范包含两层规范:数据模板 （DTD）、数据占位符 (DPD)
> - 数据模板中的每个属性由 3 部分构成:**属性名 name、生成规则 rule、属性值
	value: 'name|rule': value

> 属性名和生成规则之间用竖线`|`分隔,生成规则是可选的,有 7 种格式:

<font color="#ff0000">'name|min-max': value</font>
<font color="#ff0000">'namelcount': value</font>
<font color="#ff0000">'name|min-max.dmin-dmax': value</font>
<font color="#ff0000">'name|min-max.dcount': value</font>
<font color="#ff0000">'name|count.dmin-dmax': value</font>
<font color="#ff0000">'name|count.dcount': value</font>
<font color="#ff0000">'name|+step': value</font>
## 13.5 生成规则与示例
1. 属性值是字符串 String

```js
//通过重复 string 生成一个字符串,重复次数大于等于 min,小于等于 max。
'name|min-max': string
//通过重复 string 生成一个字符串,重复次数等于 count。
'name|count': string
var data = Mock.mock ({
   'name 1|1-3': 'a',  //重复生成 1 到 3 个 a（随机）
   'name 2|2': 'b'   / /生成 bb
})
```
2. 属性值是数字 Number

```js
/ /属性值自动加 1,初始值为 number。
'name|+1': number
//生成一个大于等于 min、小于等于 max 的整数,属性值 number 只是用来确定类型。
'name|min-max': number
//生成一个浮点数,整数部分大于等于 min、小于等于 max,小数部分保留 dmin 到 dmax 位。
'name|min-max.dmin-dmax': number
Mock.mock({
     'number1|1-100.1-10': 1,
     'number2|123.1-10': 1,
     'number3|123.3': 1,
     'number4|123.10': 1 123
})
//结果:
{
    "number1": 12.92,
    "number2": 123.51,
    "number3": 123.777,
    "number4":123.1231091814
}
var data = Mock.mock({
    'name1|+1':4,   //生成4,如果循环每次加1
    'name2|1-7':2,   //生成一个数字,1到7之间
    'name3|1-4.5-8':1 ////生成一个小数,整数部分1到4,小数部分5到8位,数字1只是为了确定类型
})
```
3. 属性值是布尔型 Boolean

```js
//随机生成一个布尔值,值为 true 的概率是 1/2,值为 false 的概率同样是1/2。
'namel1': bolean
//随机生成一个布尔值,值为 value 的概率是 min/（min+max),值为!value 的概率是 max／（min+max）。
'name|min-max': value
var data = Mock.mock({
    'name|1': true,   //生成一个布尔值,各一半
    'name1|1-3': true  //1/4 是 true,3/4 是 false
})
```
4. 属性值是对象 Object

```js
//从属性值 object 中随机选取 count 个属性。
'name|count': object
//从属性值 object 中随机选取 min 到 max 个属性。
'name|min-max': object
var obj = {
   a: 1,
   b: 2,
   c: 3,
   d: 4
}
var data = Mock.mock ({
    'name|1-3': obj,  //随机从 obj 中寻找 1 到 3 个属性,新对象
    'name|2': obj   //随机从 onj 中找到两个属性,新对象
})
```
5. 属性值是数组 Array

```js
//从属性值 array 中随机选取 1 个元素,作为最终值。
'name|1': array
//从属性值 array 中顺序选取 1 个元素,作为最终值。
'name|+1': array
//通过重复属性值 array 生成一个新数组,重复次数大于等于 min,小于等于 max。
'name|min-max': array
//通过重复属性值 array 生成一个新数组,重复次数为 count。
'name|count': array
Mock.mock({
   //通过重复属性值 array 生成一个新数组,重复次数为 1-3次。
   "favorite_games|1-3": [3,5,4,6,23,28,42,45],
}); 
var arr = [1,2,3];
var data = Mock.mock ({
   'namel|1': arr,   //从数组里随机取出 1 个值
   'name2|2': arr,   //数组重复 count 次,这里 count 为2
   'name3|1-3': arr,  //数组重复 1 到 3 次
})
```
6. 属性值是函数 Function

执行函数 function,取其返回值作为最终的属性值,函数的上下文为属性'name’所在的对象。
'name': function
```js
var fun = function (x)
   return x+10;
1
var data = Mock.mock ({
   'name': fun (10)   //返回函数的返回值 20
})
```
7. 属性值是正则表达式 RegExp

根据正则表达式 regexp 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。
'name': regexp
```js
Mock.mock ({
    'regexp 1': /[a-z][A-z][0-9]/,
    'regexp 2': /\w\w\s|s\d\D/,
    'regexp 3': /d[5,103/
})
// =>
{
    "regexp1": "pJ7",
    "regexp2": "F)\fp1G",
    "regexp3": "561659409"
}
```
## 13.6 数据占位符 DPD
占位符只是在属性值字符串中占个位置,并不出现在最终的属性值中。
占位符的格式为:
> **@占位符
> @占位符 (参数［,参数])**

关于占位符需要知道以下几点
 - 用`@`标识符标识后面的字符串是占位符
 - 占位符引用的是 `Mock.Random` 中的方法。
 - 可以通过 `Mock.Random.extend (）`来扩展自定义占位符。
 - 占位符也**可以引用数据模板中的属性**。
 - 占位符会**优先引用数据模板中的属性**。
 - 占位符支持**相对路径和绝对路径**。

```js
//引入mockjs
import Mock from 'mockjs'
//使用mockjs模拟数据
Mock.mock('/api/msdk/proxy/query_common_credit', {
   "ret":0,
   "data":
   {
       "mtime":"@datetime",//随机生成日期时间
       "score": "@natural(1,800)",//随机生成1-800的数字
       "rank":"@natural(1,100)",//随机生成1-100的数字
       "stars":"@natural(0,5)",//随机生成1-5的数字
       "nickname":"@cname",//随机生成中文名字
}) ;
```
### 13.6.1 基础随机内容的生成
```js
{
  "string|1-10":"=",//随机生成 1 到 10 个等号
  "string2|3":"=",//随机生成 2 个或者三个等号
  "number|+1":0,//从 o 开始自增
  "number 2|1-10.1-3":1,//生成一个小数,小数点前面 1 到 10,小数点后 1 到 3 位
  "boolean":"@boolean（1,2,true）",//生成 boolean 值三个参数,1 表示第三个参数 true 出现的概率,2 表示 false 出现的概率
  "name":"@cname",//随机生成中文姓名
  "firstname":"@cfirst",//随机生成中文姓
  "int":"@integer(1,10)",//随机生成 1-10 的整数
  "float":"@float (1,2,3,4)",//随机生成浮点数,四个参数分别为,整数部分的最大最小值和小数部分的最大最小值
  "range":"@range(1,100,10)",//随机生成整数数组,三个参数为,最大最小值和加的步长
  "natural":"@natural(60,100)",//随机生成自然数（大于零的数）
  "email":"@email",//邮箱
  "ip": "@ip",// ip
  "datatime":"@date（'yy-MM-ddhh:mm: ss')"//随机生成指定格式的时间
  //
}
```
### 13.6.2 列表数据
```js
 {
   "code";"0000",
   "data": {
     "pageNo": "@integer (1, 100)",
     "totalRecord": "@integer (100, 1000)",
     "pagesize": 10,
     "list|10": [{
       "id|+1": 1,
       "name": "@cword(10)",
       "title": "@cword(20)",
       "descript": "@csentence(20,50)",
       "price": "@float(10,100,10,100)",
    }]
  },
   "desc": "成功"
 }
```
### 13.6.3 图片
mockjs 可以生成任意大小，任意颜色块，且用文字填充内容的图片，使我们不用到处找图片资源就能轻松实现图片的模拟展示
```js
{
  "code": "0000",
  "data": {
    "pageNo": "@integer(1, 100)",
    "totalRecord": "@integer(100, 1000)",
    "pagesize": 10,
    "list|10": [{
     //参数从左到右依次为，图片尺寸，背景色，前景色（及文字颜色），图片格式，图片中间的填充文字内容
     "image": "@image ('200 x 100'，'#ffcc33 '，'#FFF'，'png'，'Fast Mock')"
   }]
  },
  "desc":"成功"
}
```
### 13.6.4 Mock. Random
> Mock. Random 是一个工具类，用于生成各种随机数据。
> 
> Mock. Random 的方法在数据模板中称为『占位符』，书写格式为@占位符 (参数[, 参数)。
> 用法示例:

```js
 var Random = Mock.Random
 Random.email()
 // => " n.clark@mi1ler.io "
 Mock.mock('@email')
 // => " y.lee@lewis.org "
 Mock.mock({email: '@email'})
 // => { email: "v.lewis@hall.gov" }
```
## 13.7 总结
> [!NOTE] tips
> 如果前端请求的后端接口需要携带参数，那么前端 mock 的 index. js 里的拦截请求的写法应该如下所示（用正则表达式进行匹配接口）：
> `Mock.mock(RegExp('/product/search.*'),{...})`

# 14 企业级集成方案
## 14.1 vue-element-admin 介绍
> - vue-element-admin 是一个后台前端解决方案，它基于 vue 和 element-ui 实现。
> - 内置了 i 18 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件。
> - 可以快速搭建企业级中后台产品原型。
> - 地址: https://panjiachen.github.io/vue-element-admin-site/zh/guide/

```shell
# 克隆项目
git clone https://github.com/PanJiaChen/vue-admin-template.git
# 进入项目目录
cd vue-admin-template
# 安装依赖
npm install
# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org
# 启动服务
npm run dev
```
# 15 JWT 跨域认证
## 15.1 Session 认证
互联网服务离不开用户认证。一般流程是下面这样。
>   - 用户向服务器发送**用户名和密码**。
>   - 服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色、登录时间等。
>   - 服务器向用户返回一个 session_id，写入用户的 Cookie。
>   - 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
>   - 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

session 认证流程：
![|350](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202307311353929.png)
session 认证的方式应用非常普遍，但也存在一些问题，扩展性不好，如果是服务
器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能
够读取 session，针对此种问题一般有两种方案:

>  1. 一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。
> 
>  2. 一种方案是服务器不再保存 session 数据，所有数据都保存在客户端，每次请求都发回服务器。Token 认证就是这种方案的一个代表。

## 15.2 Token 认证

Token 是在服务端产生的一串字符串, 是客户端访问资源接口（API) 时所需要的资
源凭证，流程如下：

>   - 客户端使用用户名跟密码请求登录，服务端收到请求，去验证用户名与密码
>   - 验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端
>   - 客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里
>   - 客户端每次向服务端请求资源的时候需要带着服务端签发的 token
>   - 服务端收到请求，然后去验证客户端请求里面带着的 token，如果验证成功，就向客户端返回请求的数据

![image.png|350](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202307311410745.png)
- 基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放
token 数据。

- 用解析 token 的计算时间换取 session 的存储空间，从而减轻服务器的压力
减少频繁的查询数据库

- token 完全由应用管理，所以它可以避开同源策略

---
## 15.3 JWT 的使用

> JSON Web Token（简称 JWT）是一个 token 的具体实现方式，是目前最流行
> 的跨域认证解决方案。
> JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，具体如下:

```json
 "姓名": "张三",
 "角色": "管理员",
 "到期时间": "2018 年 7 月 1 日 0 点 0 分"
```

> 用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。
> 为了防止用户篡改数据，服务器在生成这个对象的时候，会加上**签名**。


>JWT 的由三个部分组成，依次如下：
  ***Header (头部)
  Payload (负载)
  Signature  (签名)***
  三部分最终组合为完整的字符串，中间使用·分隔，如下：
  Header.Payload.Signature
           `eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9. eyJzdwIi0iIxMjMoNTY30DkwIiwibmFtzsI6IkpvaG4 gRG91IiwiaXNTb2NpYWwiOnRydwV9. 4pcPyMD09o1PSyXnrXCjTwXyr4BsezdI1AVTmud2fU4`

### 15.3.1 Header

> Header 部分是一个 JSON 对象，描述 JWT 的元数据

```json
{
 "alg": "H256",
 "typ": "JWT"
}
```

- alg 属性表示签名的算法（**algorithm**），默认是 HMAC SHA 256 (写成
**HS256**)
- typ 属性表示这个令牌（token）的类型（type），JWT 令牌统一写为 JWT
- 最后，将上面的 JSON 对象使用 Base 64 URL 算法转成字符串。

### 15.3.2 Payload

> Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了 7 个官方字段，供选用。


- iss (issuer)：签发人
- exp (expiration time): 过期时间
- sub (subject): 主题
- aud (audience): 受众
- nbf (Not Before): 生效时间
- iat (Issued At)：签发时间
- jti (WT ID): 编号

> 注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在个部分。
   这个 JSON 对象也要使用 **Base 64 URL** 算法转成字符串。


### 15.3.3 Signature

>  Signature 部分是对前两部分的签名，防止数据篡改。
	首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户; 然后，使用 Header 里面指定的签名算法 （默认是 HMAC SHA 256），按照下面的公式产生签名。

```json
HMACSHA 256 (
base64UrlEncode (header) + "." +
base64UrlEncode (payload),
secret)
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点”（'.'）分隔，就可以返回给用户。
![image.png|450](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202307311433682.png)

### 15.3.4 特点

- 客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。
- 客户端每次与服务器通信，都要带上这个 JWT，可以把它放在 Cookie 里面自动发送，但是这样不能跨域。
- 更好的做法是放在 HTTP 请求的头信息'Authorization'字段里面，单独发送。


### 15.3.5 请求认证

![image.png|525](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202309262023932.png)


### 15.3.6 JWT验证拦截器

![image.png|250](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202309272236587.png)



定义拦截器：

```java
package com.alleyf.config;  
  
import com.alibaba.fastjson2.JSON;  
import com.alleyf.sys.utils.Result;  
import com.alleyf.common.JwtUtils;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Component;  
import org.springframework.web.servlet.HandlerInterceptor;  
  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
  
@Component  
@Slf4j  
public class JwtValidateInterceptor implements HandlerInterceptor {  
    @Autowired  
    private JwtUtils jwtUtils;  
  
    @Override  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {  
        String token = request.getHeader("X-Token");  
        log.debug(request.getRequestURI() + "待验证：" + token);  
        if (token != null) {  
            try {  
                jwtUtils.getClaimsByToken(token);  
                log.debug(request.getRequestURI() + " 验证通过");  
                return true;  
            } catch (Exception e) {  
                e.printStackTrace();  
            }  
        }  
        log.debug(request.getRequestURI() + " 禁止访问");  
        response.setContentType("application/json;charset=utf-8");  
        response.getWriter().write(JSON.toJSONString(Result.error().message("jwt令牌无效，请重新登录")));  
        return false;  
    }  
}

```

配置使用拦截器


```java
package com.alleyf.config;  
  
import com.alleyf.config.JwtValidateInterceptor;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;  
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;  
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;  
  
@Configuration  
public class MyInterceptorConfig implements WebMvcConfigurer {  
    @Autowired  
    private JwtValidateInterceptor jwtValidateInterceptor;  
  
    @Override  
    public void addInterceptors(InterceptorRegistry registry) {  
        InterceptorRegistration registration = registry.addInterceptor(jwtValidateInterceptor);  
        registration.addPathPatterns("/**").excludePathPatterns(  
                "/user/login",  
                "/user/register",  
                "/user/logout",  
                "/user/info",  
                "/error"  
        );  
    }  
}

```

### 15.3.7 后端实现

#### 15.3.7.1 加入依赖

```xml
<dependency>
   <groupId>io.jsonwebtoken</groupId>
   <artifactId>jjwt</artifactId>
   <version>0.9.1</version>
</dependency>
```

#### 15.3.7.2 生成 Token

```java
//7 天过期
private static Long expire = 604800;
//32 位秘钥
private static String secret = "abcdfghiabcdfghiabcdfghiabcdfghi";

//生成 token
public static String generateToken(String username){
   Date now = new Date();
   Date expiration = new Date (now.getTime() + 1000 * expire);
   return Jwts.builder ()
            .setHeaderParam("type","JWT")
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(expiration)
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
}
```

#### 15.3.7.3 解析 token

```java
public static Claims getClaimsByToken(String token) {  
    return Jwts.parser()  
            .setSigningKey(secret)  
            .parseClaimsJws(token)  
            .getBody();  
  
}
```

#### 15.3.7.4 后端完整部分

`UserController. java:`
```java
/*  
 * Copyright (c) alleyf 2023 - 6 - 1 19:56 * 适度编码益脑，沉迷编码伤身，合理安排时间，享受快乐生活。 * */  
package com.alleyf.airesume.controller;  
  
import com.alleyf.airesume.entity.User;  
import com.alleyf.airesume.mapper.UserMapper;  
import com.alleyf.airesume.utils.JwtUtils;  
import com.alleyf.airesume.utils.Result;  
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;  
import com.baomidou.mybatisplus.core.metadata.IPage;  
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;  
import io.swagger.annotations.Api;  
import io.swagger.annotations.ApiOperation;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.web.bind.annotation.*;  
  
import java.util.List;  
  
@Api(tags = "用户", value = "用户")  
@RestController  
@CrossOrigin  
@RequestMapping("/user")  
public class UserController {  
    @Autowired  
    UserMapper userMapper;  

    @ApiOperation("用户登录")  
    @PostMapping("/login")  
    public Result login(@RequestBody User user) {  
        String token = JwtUtils.generateToken(user.getUsername());  
        return Result.ok().data("token", token);  
    }  
  
    @ApiOperation("获取用户信息")  
    @GetMapping("/info")  //"token:xxx"  
    public Result info(String token) {  
        String username = JwtUtils.getClaimsByToken(token).getSubject();  
        String url = "https://img2.baidu.com/it/u=1325995315,4158780794&fm=26&fmt=auto&gp=0.jpg";  
        return Result.ok().data("name", username).data("avatar", url);  
    }  
  
    @ApiOperation("注销")  
    @PostMapping("/logout") // "token:xxx"  
    public Result logout() {  
        return Result.ok();  
    }  
  
    @ApiOperation("查询所有用户")  
    @GetMapping("/queryAll")  
    public List<User> queryAllUser() {  
//        return userMapper.selectList(null);  
        return userMapper.queryAllUserAndTask();  
    }  
  
    @ApiOperation("按照用户名查询用户")  
    @GetMapping("/queryByMName")  
    public User queryByMName(@RequestParam("username") String username) {  
//        return userMapper.selectList(null);  
        return userMapper.selectByName(username);  
    }  
  
    @ApiOperation("按照用户名查询用户(MP)")  
    @GetMapping("/queryByMPName")  
    public User queryByMPName(@RequestParam("username") String username) {  
        return userMapper.selectOne(new QueryWrapper<User>().eq("username", username));  
    }  
  
    @ApiOperation("按照用户名路径查询用户(MP)")  
    @GetMapping("/queryByPMPName/{username}")  
    public User queryByPMPName(@PathVariable("username") String username) {  
        return userMapper.selectOne(new QueryWrapper<User>().eq("username", username));  
    }  
  
    @ApiOperation("按照页码查询用户(MP)")  
    @GetMapping("/queryByPage/{page}")  
    public IPage queryByPage(@PathVariable("page") int page) {  
        Page<User> page1 = new Page<>(page, 5);  
        IPage iPage = userMapper.selectPage(page1, null);  
        return iPage;  
    }  
  
    @ApiOperation("添加用户")  
    @PostMapping("/add")  
    public String addUser(User user) {  
        return userMapper.insert(user) > 0 ? "添加成功" : "添加失败";  
    }  
}
```

`Result.java:`
```java
/*  
 * Copyright (c) alleyf 2023 - 5 - 29 }9:52 * 适度编码益脑，沉迷编码伤身，合理安排时间，享受快乐生活。 * */  
package com.alleyf.airesume.utils;  
  
import java.util.HashMap;  
import java.util.Map;  
  
public class Result {  
    private Boolean success;  
    private Integer code;  
    private String message;  
    private Map<String, Object> data = new HashMap<>();  
  
    private Result() {  
    }  
  
    public static Result ok() {  
        Result r = new Result();  
        r.setCode(ResultCode.Success);  
        r.setSuccess(true);  
        r.setMessage("成功");  
        return r;  
    }  
  
    public static Result error() {  
        Result r = new Result();  
        r.setCode(ResultCode.Error);  
        r.setSuccess(false);  
        r.setMessage("失败");  
        return r;  
    }  
  
    public Result success(Boolean success) {  
        this.setSuccess(success);  
        return this;  
    }  
  
    public Result message(String message) {  
        this.setMessage(message);  
        return this;  
    }  
  
    public Result code(Integer code) {  
        this.setCode(code);  
        return this;  
    }  
  
    public Result data(String key, Object value) {  
        this.data.put(key, value);  
        return this;  
    }  
  
    public Result data(Map<String, Object> map) {  
        this.setData(map);  
        return this;  
    }  
  
    public Boolean getSuccess() {  
        return success;  
    }  
  
    public void setSuccess(Boolean success) {  
        this.success = success;  
    }  
  
    public Integer getCode() {  
        return code;  
    }  
  
    public void setCode(Integer code) {  
        this.code = code;  
    }  
  
    public String getMessage() {  
        return message;  
    }  
  
    public void setMessage(String message) {  
        this.message = message;  
    }  
  
    public Map<String, Object> getData() {  
        return data;  
    }  
  
    public void setData(Map<String, Object> data) {  
        this.data = data;  
    }  
}
```

`JwtUtils.java:`
```java
package com.alleyf.airesume.utils;  
  
import io.jsonwebtoken.Claims;  
import io.jsonwebtoken.Jwts;  
import io.jsonwebtoken.SignatureAlgorithm;  
  
import java.util.Date;  
  
public class JwtUtils {  
    //7 天过期  
    private static final Long expire = 604800L;  
    //32 位秘钥  
    private static final String secret = "abcdfghiabcdfghiabcdfghiabcdfghi";  
  
    //生成 token  
    public static String generateToken(String username) {  
        Date now = new Date();  
        Date expiration = new Date(now.getTime() + 1000 * expire);  
        return Jwts.builder()  
                .setHeaderParam("type", "JWT")  
                .setSubject(username)  
                .setIssuedAt(now)  
                .setExpiration(expiration)  
                .signWith(SignatureAlgorithm.HS512, secret)  
                .compact();  
    }  
  
    public static Claims getClaimsByToken(String token) {  
        return Jwts.parser()  
                .setSigningKey(secret)  
                .parseClaimsJws(token)  
                .getBody();  
  
    }  
}
```

