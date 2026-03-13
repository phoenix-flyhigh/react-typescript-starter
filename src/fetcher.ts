// endpoints -> ['devtools.tech/v2/questions', 'devtools.tech/v1/questions']
// endpoint with smaller index has more priority. we should return the response of the endpoint that resolves successfully 
// and has the smallest index in the endpoints array.


export const getResponseOnPriority = (endpoints: string[]) => {
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
        return Promise.reject("Endpoints must be valid non empty array")
    }

    return new Promise((resolve, reject) => {
        const results = new Array(endpoints.length)
        let settled = 0;
        let resolved = false
        const abortController = new AbortController()
        const signal = abortController.signal
        endpoints.forEach((endpoint, index) => fetch(endpoint, { signal }).then(res => {
            if (res.ok) {
                return res.json()
            }
            throw new Error("not successful")
        })
            .then(data => {
                results[index] = { success: true, data }
            })
            .catch(err => {
                results[index] = { success: false, err }
            })
            .finally(() => {
                settled++
                checkResolution()
            }))

        const checkResolution = () => {
            if (resolved) return;
            for (let result of results) {
                if (result === undefined) {
                    return;
                }
                else if (result.success) {
                    resolved = true
                    resolve(result.data)
                    abortController.abort()
                    return;
                }
            }
            if (settled === endpoints.length) {
                reject("all api failed")
            }
        }
    })
}
