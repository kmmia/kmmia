module.exports = {
	apps: [
		{
			name: 'Project Mirai',
			script: './index.js',
			autorestart: true,
			exec_mode: 'cluster',
			pmx: false,
			vizion: false,
			cwd: __dirname,
			instances: 1,
			watch: false,
			merge_logs: true,
			exec_interpreter: "node",
			env: {
				"NODE_ENV": "production"
			}
		}
	]
};