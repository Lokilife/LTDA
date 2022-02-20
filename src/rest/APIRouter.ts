import fetch from 'node-fetch'

const methods = ['get', 'post', 'delete', 'patch', 'put']

export default function APIRouter(api: string, token: string): any {
    let route = []

    const handler = {
        get: function (_target: any, parameter: string | symbol) {
            if (methods.includes(parameter.toString())) {
                return async (data: any) => await (await fetch(`${api}/${route.join('/')}`, {
                    method: parameter.toString(),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bot ${token}`
                    },
                    body: data ? JSON.stringify(data) : null
                })).json()
            }
            route.push(parameter.toString())
            return new Proxy(() => {}, handler)
        }
    }
    return new Proxy({}, handler)
}
