import fetch from 'node-fetch'

export default function RouteBuilder(api: string, token: string): any {
    let method
    let APIRouter = ''

    async function handleSend(body: any) {
        const response = await fetch(`${api}${APIRouter}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${token}`
            },
            method,
            body: body ? JSON.stringify(body) : null
        })

        APIRouter = ''
        return await response.json()
    }

    function handleGet(_target, parameter: string | symbol) {
        switch (parameter) {
            case 'get': method = 'GET'; break;
            case 'post': method = 'POST'; break;
            case 'delete': method = 'DELETE'; break;
            case 'put': method = 'PUT'; break;
            
            default: APIRouter += `/${parameter.toString()}`; break;
        }

        return new Proxy(handleSend, {get: handleGet})
    }

    return new Proxy({}, {get: handleGet})
}
