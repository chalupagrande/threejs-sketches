class EventingLibrary {
  constructor() {
    this.library = {}
  }

  on(name, func, ...args) {
    if (!this.library[name]) {
      this.library[name] = []
    }
    this.library[name].push([func, args])
  }

  remove(name, func) {
    const arr = this.library[name]
    let index = arr.findIndex(([cb]) => cb === func)
    arr.splice(index, 1)
  }

  emit(name) {
    const arr = this.library[name]
    arr.forEach(([func, args]) => {
      if (args) func(...args)
      else func()
    })
  }
}

export default Eventing
