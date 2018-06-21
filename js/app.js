// 匿名自调用函数作用： 
// 防止变量污染，模仿块级作用域，减少作用域的查找范围提高代码的性能和执行速度
// 声明模块依赖
(function (window) {
	const todos = JSON.parse(window.localStorage.getItem('todos'))||[]
	// console.log(todos)
	// 全局自定义指令获取光标
	Vue.directive('focus', {
		inserted: function(el){
			el.focus()
		}
	})
	var app = new Vue({
		el: "#app",
		data: {
			txt: '',
			hash: '',
			currentEdit: null,
			todos: todos,
			filterToDos: [],
				// {title: '吃饭', done: true, id: 1}, 
				// {title: '睡觉', done: false, id: 2}, 
				// {title: '敲代码', done: false, id: 3}
		},
		methods: {
			// 回车添加任务
			addToDo: function() {
				// console.log(this.txt)
				console.log(this.hash)
				// 判断哈希值在已完成页面添加的数据为已完成项
				if(this.hash === '#/completed'){
					this.todos.push({
						title: this.txt,
						done: true,
						// 三元表达式解决空数组无法访问-1项的数据问题
						id: this.todos.length==0 ? 1 : this.todos[this.todos.length-1].id+1
					})
				}else{
					this.todos.push({
						title: this.txt,
						done: false,
						// 三元表达式解决空数组无法访问-1项的数据问题
						id: this.todos.length==0 ? 1 : this.todos[this.todos.length-1].id+1
					})
				}
				
				this.txt = ""
				// console.log(this.todos[this.todos.length-1].id)
			},
			// esc取消添加任务
			cancelAdd: function() {
				this.txt = ""
			},
			// 点击删除移除任务项
			removeTodo: function(id) {
				// console.log(id)
				this.todos = this.todos.filter(function(item, index){
					return item.id != id
				})
			},
			// 双击进入编辑任务
			getEditing: function(item){
				// console.log(item)
				this.currentEdit = item
			},
			// 回车保存编辑内容
			saveEdit: function(item,index,e){
				if(e.target.value.trim()){
					this.todos[index].title = e.target.value
				}else{
					this.todos.splice(index, 1)
				}
				this.currentEdit = null
			},
			// 按esc取消编辑任务
			cancelEdit: function() {
				console.log(000)
				this.currentEdit = null
			},
			// 剩余任务数量
			remainToDoNum: function() {
				return this.todos.filter(function(item, index){return item.done === false}).length
			},
			displayStatus:  function() {
				if(this.todos.length === 0){
					return true
				}else{
					return false
				}
			},
			clearToDo: function(){
				this.todos = []
			}
		},
		computed: {
			// 全选按钮检测
			toggleAllStatus: {
				get: function(){
					return this.todos.every(function(item){ return item.done })
				},
				set: function(val){
					// console.log(val)
					this.todos.forEach(function(item){ item.done = val })
					// console.log(this.todos)
				}
			},	
		},
		watch: {
			todos: {
				handler: function(val,oldval){
					window.localStorage.setItem('todos',JSON.stringify(val))
					window.onhashchange()
				},
				deep: true,
			}
		},
		// 注册局部指令
		directives: {
			'todo-focus': {
				update(el, binding){
					console.log(el)
					console.log(binding)
					if(binding.value === true){
						el.focus()
					}
				}
			}
		}
	})
	window.app = app
	window.onhashchange = function(){
		const {hash} = window.location
		app.hash = hash
		switch(hash){
			case '#/active':
				app.filterToDos = app.todos.filter(function(item, index){
					return !item.done
				})
				break;
			case '#/completed':
				app.filterToDos = app.todos.filter(function(item, index){
					return item.done
				})
				break;
			default:
				app.hash = '#/'
				app.filterToDos = app.todos
				// console.log(app.filterToDos)
				break 
		}
	}
	window.onhashchange()
})(window);
