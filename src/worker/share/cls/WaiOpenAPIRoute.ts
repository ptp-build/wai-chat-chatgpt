import { OpenAPIRoute } from '@cloudflare/itty-router-openapi';
import { getCorsHeader } from '../utils/utils';
import { ENV } from '../../env';

//@ts-ignore
export default class WaiOpenAPIRoute extends OpenAPIRoute {
	jsonResp(params: { data: Record<string, any>; status?: number }): Response {
		return new Response(JSON.stringify(params.data), {
			headers: {
				...getCorsHeader(ENV.Access_Control_Allow_Origin),
			},
			status: params.status || 200,
		});
	}
	static responseError(error = '', status = 500) {
		return WaiOpenAPIRoute.responseJson({ error, status }, status);
	}
	static responseJson(data: object, status = 200) {
		return new Response(JSON.stringify(data), {
			status,
			headers: {
				...getCorsHeader(ENV.Access_Control_Allow_Origin),
			},
		});
	}
}
