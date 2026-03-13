// endpoints -> ['devtools.tech/v2/questions', 'devtools.tech/v1/questions']
// endpoint with smaller index has more priority. we should return the response of the endpoint that resolves successfully 
// and has the smallest index in the endpoints array.


export const getResponseOnPriorityWithPromises = (promises:(() => Promise<unknown>)[]) => {
    if (!Array.isArray(promises) || promises.length === 0) {
        return Promise.reject("Endpoints must be valid non empty array")
    }

    return new Promise((resolve, reject) => {
        const results = new Array(promises.length)
        let settled = 0;
        let resolved = false
        promises.forEach((promise, index) => promise()
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
                    resolve(result)
                    return;
                }
            }
            if (settled === promises.length) {
                reject("all api failed")
            }
        }
    })
}


// Test

const promise1 = () => new Promise(resolve => {
    setTimeout(() => {
        resolve("high priority, time taking")
    }, 2000)
})
const promise2 = () => new Promise(resolve => {
    setTimeout(() => {
        resolve("low priority, less time taking")
    }, 200)
})
const promise3 = () => new Promise((_, reject) => {
    setTimeout(() => {
        reject("high priority, fails")
    }, 2000)
})
const promise4 = () => new Promise(resolve => {
    setTimeout(() => {
        resolve("low priority, succeeds")
    }, 200)
})

const promise5 = () => new Promise(resolve => {
    setTimeout(() => {
        resolve("high priority, finishes first")
    }, 200)
})
const promise6 = () => new Promise(resolve => {
    setTimeout(() => {
        resolve("low priority, more time taking")
    }, 400)
})

let res1 = await getResponseOnPriorityWithPromises([promise1, promise2])
let res2 = await getResponseOnPriorityWithPromises([promise3, promise4])
let res3 = await getResponseOnPriorityWithPromises([promise5, promise6])
console.log("res1", res1) // expected to resolve promise 1 after 2000ms
console.log("res2", res2) // expected to resolve promise 4 after 2000ms
console.log("res3", res3) // expected to resolve promise 5 after 200ms