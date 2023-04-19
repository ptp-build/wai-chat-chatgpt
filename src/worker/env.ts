export const ENV: {
	IS_PROD: boolean;
	OPENAI_API_KEY: string;
	Access_Control_Allow_Origin: string;
} = {
	IS_PROD: true,
	OPENAI_API_KEY: '',
	Access_Control_Allow_Origin: '*',
};

export function initEnv(env: Record<string, any>) {
	for (const key in ENV) {
		if (env[key] !== undefined) {
			// @ts-ignore
			ENV[key] = env[key];
		}
	}
}
