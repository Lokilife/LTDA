export function Bind() {
  return function <T extends Function>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void {
    return {
      configurable: true,
      get(this: T): T {
        const value = descriptor.value?.bind(this)
        Object.defineProperty(this, propertyKey, {
          value,
          configurable: true,
          writable: true,
        })
        return value
      },
    }
  }
}

// I'm a little bit doubt that i'm writing this right but idk
export function Deprecated() {
  return function <T extends Function>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void {
    return {
      configurable: true,
      get(this: T): T {
        const value = (...args: any) => {
          console.warn(
            `[DEPRECATION WARNING]: Method "${this.constructor.name}#${String(
              propertyKey,
            )}" deprecated, look to the documentation.`,
          )
          descriptor.value.call(this, ...args)
        }
        Object.defineProperty(this, propertyKey, {
          value,
          configurable: true,
          writable: true,
        })
        return value as any
      },
    }
  }
}
export function CommingSoon() {
  return function <T extends Function>(
    _target: object,
    propertyKey: string | symbol,
  ): TypedPropertyDescriptor<T> | void {
    return {
      configurable: true,
      get(this: T): T {
        const value = (...args: any) =>
          console.warn(
            `[Comming Soon]: Property "${this.constructor.name}#${String(
              propertyKey,
            )}" isn't done yet, but you can hurry up Lokilife.`,
          )
        Object.defineProperty(this, propertyKey, {
          value,
          configurable: true,
          writable: true,
        })
        return value as any
      },
    }
  }
}
