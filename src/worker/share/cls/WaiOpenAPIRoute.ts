import { OpenAPIRoute } from '@cloudflare/itty-router-openapi';
import { getCorsHeader } from '../utils/utils';
import { ENV } from '../../env';

//@ts-ignore
export default class WaiOpenAPIRoute extends OpenAPIRoute {
	async checkIfTokenIsInvalid(request: Request) {
		if (ENV.IS_PROD) {
			const auth = request.headers.get('Authorization');
			if (!auth) {
				return WaiOpenAPIRoute.responseError('Authorization required', 400);
			}
			if (auth?.indexOf('Bearer ') !== 0) {
				return WaiOpenAPIRoute.responseError('Authorization invalid', 400);
			}
			const token = auth.replace('Bearer ', '');
			if (ENV.OPENAI_API_KEY && ENV.TOKENS.indexOf(token) === -1) {
				return WaiOpenAPIRoute.responseError('token invalid', 401);
			}
		}
		return false;
	}

	jsonResp(params: { data: Record<string, any>; status?: number }): Response {
		return new Response(JSON.stringify(params.data), {
			headers: {
				...getCorsHeader(ENV.Access_Control_Allow_Origin),
			},
			status: params.status || 200,
		});
	}

	static responseData(data: any, status = 200) {
		return new Response(data, {
			status,
			headers: {
				...getCorsHeader(ENV.Access_Control_Allow_Origin),
			},
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
