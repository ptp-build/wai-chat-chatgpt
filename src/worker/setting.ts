export const SWAGGER_DOC = {
	schema: {
		info: {
			title: 'Wai ChatGpt',
			version: '1.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					description: '请输入 openAi api_key',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
};
