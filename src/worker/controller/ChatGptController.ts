import { Str, Bool, DateOnly, Int } from '@cloudflare/itty-router-openapi';
import WaiOpenAPIRoute from '../share/cls/WaiOpenAPIRoute';
import { createStream, requestOpenAi } from '../share/functions/openai';
import { ENV } from '../env';
import { currentTs1000 } from '../share/utils/utils';

const Message = {
	role: new Str({
		example: 'user',
		description: '角色: user | system | assistant',
	}),
	content: new Str({
		example: '我的第一个命令是 pwd',
		description: '问题',
	}),
};

const requestBody = {
	apiKey: new Str({
		example: '',
		description: 'openAi api_key',
	}),
	systemPrompt: new Str({
		example:
			'我想让你充当 Linux 终端。我将输入命令，您将回复终端应显示的内容。我希望您只在一个唯一的代码块内回复终端输出，而不是其他任何内容。不要写解释。除非我指示您这样做，否则不要键入命令。当我需要用英语告诉你一些事情时，我会把文字放在中括号内[就像这样]',
		description: '系统 prompt',
	}),
	messages: [Message],
	stream: new Bool({
		example: false,
		description: '是否使用 stream',
	}),
	model: new Str({
		example: 'gpt-3.5-turbo',
		description: 'chatGpt model: gpt-3.5-turbo | gpt-4',
	}),
	temperature: new Int({
		example: 1,
		description: '随机性 (temperature): 值越大，回复越随机',
	}),

	max_tokens: new Int({
		example: 2000,
		description: '单次回复限制 (max_tokens): 单次交互所用的最大 Token 数, max_tokens < 4096',
	}),
	presence_penalty: new Int({
		example: 0,
		description:
			'话题新鲜度 (presence_penalty): 值越大，越有可能扩展到新话题,-2 < presence_penalty < 2',
	}),
};

const Commands = [
	{
		command: 'apiKey',
		description: '设置 OpenAi apiKey',
	},
	{
		command: 'aiModel',
		description: '模型设置',
	},
	{
		command: 'systemPrompt',
		description: '系统prompt',
	},
];

export class ChatGptAction extends WaiOpenAPIRoute {
	static schema = {
		tags: ['ChatGpt'],
		requestBody,
		responses: {
			'200': {
				schema: {},
			},
		},
	};
	async handle(request: Request, data: Record<string, any>) {
		const { body } = data;
		let apiKey;
		if (!body.apiKey) {
			apiKey = ENV.OPENAI_API_KEY;
		} else {
			apiKey = body.apiKey;
		}
		delete body['apiKey'];
		let systemPrompt = '';
		if (body['systemPrompt']) {
			systemPrompt = body['systemPrompt'];
		}
		delete body['systemPrompt'];

		body.messages.unshift({
			role: 'system',
			content: systemPrompt,
		});
		try {
			if (body.stream) {
				const stream = await createStream(JSON.stringify(body), apiKey);
				return new Response(stream);
			} else {
				const res = await requestOpenAi(
					'POST',
					'v1/chat/completions',
					JSON.stringify(body),
					apiKey
				);
				return WaiOpenAPIRoute.responseJson(await res.json());
			}
		} catch (error) {
			return WaiOpenAPIRoute.responseJson(
				{
					error: {
						message: JSON.stringify(error),
					},
				},
				200
			);
		}
	}
}

export class ChatGptCommandsAction extends WaiOpenAPIRoute {
	static schema = {
		tags: ['ChatGpt'],
		responses: {
			'200': {
				schema: {},
			},
		},
	};
	async handle(request: Request, data: Record<string, any>) {
		return {
			commands: Commands,
		};
	}
}
