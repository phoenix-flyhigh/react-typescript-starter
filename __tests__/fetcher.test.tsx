import { getResponseOnPriority } from '../src/fetcher';

const mockResponse = (response: any, delay: number, shouldSucceed = true) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve({ ok: true, json: () => Promise.resolve(response) })
            }
            else {
                resolve({ ok: false })
            }
        }, delay)
    })
}

describe("Fetcher tests", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })
    it("lower priority resolves faster but higher priority succeeds later", async () => {
        const endpoints = ['abc.com', 'xyz.com']
            ; (global.fetch as jest.Mock).mockImplementation((url: string) => {
                if (url === "abc.com") return mockResponse('abc response', 1000)
                if (url === "xyz.com") return mockResponse('xyz response', 200)
            })
        let result = await getResponseOnPriority(endpoints);
        // lets say abc.com returns response 'abc response' after 1000ms
        // while xyz.com returns response 'xyz response' after 200ms
        // the code would wait till 1000ms and then return abnc response since that is on high priority in the array
        expect(result).toEqual('abc response')
    })
    it("higher priority fails after lower priority succeeds", async () => {
        const endpoints = ['abc.com', 'xyz.com']
            ; (global.fetch as jest.Mock).mockImplementation((url: string) => {
                if (url === "abc.com") return mockResponse(null, 1000, false)
                if (url === "xyz.com") return mockResponse('xyz response', 200)
            })
        let result = await getResponseOnPriority(endpoints);
        expect(result).toEqual('xyz response')
    })
    it("Highest priority succeeds immediately", async () => {
        const endpoints = ['abc.com', 'xyz.com']
            ; (global.fetch as jest.Mock).mockImplementation((url: string) => {
                if (url === "abc.com") return mockResponse('abc response', 0)
                if (url === "xyz.com") return mockResponse('xyz response', 200)
            })
        let result = await getResponseOnPriority(endpoints);
        expect(result).toEqual('abc response')
    })
    it("All api fails", async () => {
        const endpoints = ['abc.com', 'xyz.com']
            ; (global.fetch as jest.Mock).mockImplementation((url: string) => {
                if (url === "abc.com") return mockResponse(null, 1000, false)
                if (url === "xyz.com") return mockResponse(null, 200, false)
            })
        await expect(getResponseOnPriority(endpoints)).rejects.toMatch("all api failed")
    })
    it("Empty input array", async () => {
        const endpoints: string[] = []
        await expect(getResponseOnPriority(endpoints)).rejects.toMatch("Endpoints must be valid non empty array")
    })
})