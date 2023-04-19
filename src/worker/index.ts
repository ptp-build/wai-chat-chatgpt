import { initEnv } from './env';
import { handleEvent } from './route';
addEventListener('fetch', async (event: FetchEvent) => {
	initEnv(global);
	event.respondWith(handleEvent(event));
});



