import CloudflareWorkerGlobalScope from "types-cloudflare-worker"
declare let self: CloudflareWorkerGlobalScope

export class Worker {
	public async handle(event: FetchEvent) {
		console.log(event)
		const originResponse = fetch("https://google.com", {
			cf: {
				minify: {
					html: true,
				},
			},
		})

		return originResponse
	}
}

self.addEventListener("fetch", (event: Event) => {
	const worker = new Worker()
	const fetchEvent = event as FetchEvent
	fetchEvent.respondWith(worker.handle(fetchEvent))
})
