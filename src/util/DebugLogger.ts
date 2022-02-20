import { Bind } from './decorators.js'

export default class DebugLogger {
    private className: string
    private logBuffer: Array<string> = new Array()
    private strftime: any = () => {}

    constructor(className: Function | string) {
        this.className = className instanceof Function ? className.prototype.constructor.name : className
        this.init()
    }
    private async init() {
        this.strftime = (await import('strftime')).default
    }
    
    @Bind()
    log(data: any, type: string, prefix: string = '') {
        const log = `${prefix}[${this.strftime('%R', new Date())}] [#${this.className}/${type}] ${data}\x1b[0m`
        this.logBuffer.push(log)
        if (process.env.LTDA_DEBUG == 'true')
            console.log(log)
    }

    @Bind()
    info(info: any) {
        this.log(info, 'INFO', '\x1b[32m') // \x1b[32m - Green text in console
    }

    @Bind()
    warn(info: any) {
        this.log(info, 'WARN', '\x1b[33m') // \x1b[33m - Yellow text in console
    }

    @Bind()
    error(info: any) {
        this.log(info, 'ERROR', '\x1b[31m') // \x1b[31m - Red text in console (ye, it's pretty obvious, i know)
    }
}
