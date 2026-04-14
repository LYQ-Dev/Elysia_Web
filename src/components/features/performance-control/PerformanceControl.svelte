<script lang="ts">
	interface PerformanceSettings {
		waveEffect: boolean;
		carousel: boolean;
		typewriter: boolean;
		floatingToc: boolean;
		progressBar: boolean;
		floatingPlayer: boolean;
		animations: boolean;
		pageCovers: boolean;
	}

	let isOpen = false;
	let settings: PerformanceSettings = {
		waveEffect: true,
		carousel: true,
		typewriter: true,
		floatingToc: true,
		progressBar: true,
		floatingPlayer: true,
		animations: true,
		pageCovers: true,
	};

	const defaultSettings: PerformanceSettings = { ...settings };

	function loadSettings() {
		try {
			const saved = window.localStorage.getItem('performanceSettings');
			if (saved) {
				settings = { ...defaultSettings, ...JSON.parse(saved) };
			}
		} catch (e) {
			console.log('Failed to load settings:', e);
		}
		applySettings();
	}

	function saveSettings() {
		try {
			window.localStorage.setItem('performanceSettings', JSON.stringify(settings));
		} catch (e) {
			console.log('Failed to save settings:', e);
		}
	}

	function applySettings() {
		// 设置CSS变量来控制动画
		const root = document.documentElement;
		
		if (!settings.animations) {
			root.style.setProperty('--animation-duration', '0ms');
			root.style.setProperty('--transition-duration', '0ms');
		} else {
			root.style.removeProperty('--animation-duration');
			root.style.removeProperty('--transition-duration');
		}

		// 设置data属性供JS读取
		root.setAttribute('data-wave-effect', settings.waveEffect ? 'true' : 'false');
		root.setAttribute('data-carousel', settings.carousel ? 'true' : 'false');
		root.setAttribute('data-typewriter', settings.typewriter ? 'true' : 'false');
		root.setAttribute('data-floating-toc', settings.floatingToc ? 'true' : 'false');
		root.setAttribute('data-progress-bar', settings.progressBar ? 'true' : 'false');
		root.setAttribute('data-floating-player', settings.floatingPlayer ? 'true' : 'false');
		root.setAttribute('data-page-covers', settings.pageCovers ? 'true' : 'false');

		saveSettings();
		
		// 触发自定义事件以通知其他组件
		window.dispatchEvent(new CustomEvent('performanceSettingsChanged', { detail: settings }));
	}

	function resetToDefault() {
		settings = { ...defaultSettings };
		applySettings();
	}

	function disableAll() {
		settings = {
			waveEffect: false,
			carousel: false,
			typewriter: false,
			floatingToc: false,
			progressBar: false,
			floatingPlayer: false,
			animations: false,
			pageCovers: false,
		};
		applySettings();
	}

	function enableAll() {
		settings = { ...defaultSettings };
		applySettings();
	}

	function handleToggle(key: keyof PerformanceSettings) {
		settings[key] = !settings[key];
		applySettings();
	}

	if (typeof window !== 'undefined') {
		document.addEventListener('DOMContentLoaded', loadSettings);
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', loadSettings);
		} else {
			loadSettings();
		}
	}
</script>

<div class="performance-control">
	<!-- 主按钮 -->
	<button 
		class="performance-btn"
		on:click={() => isOpen = !isOpen}
		title="性能优化面板"
	>
		<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M12 2a10 10 0 1 0 10 10H12V2"></path>
		</svg>
	</button>

	<!-- 面板 -->
	{#if isOpen}
		<div class="performance-panel">
			<div class="panel-header">
				<h3>性能优化</h3>
				<button 
					class="close-btn"
					on:click={() => isOpen = false}
					title="关闭"
				>
					✕
				</button>
			</div>

			<div class="panel-content">
				<div class="settings-group">
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.waveEffect}
							on:change={() => handleToggle('waveEffect')}
						/>
						<span>水波纹特效</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.carousel}
							on:change={() => handleToggle('carousel')}
						/>
						<span>轮播动画</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.typewriter}
							on:change={() => handleToggle('typewriter')}
						/>
						<span>打字机效果</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.floatingToc}
							on:change={() => handleToggle('floatingToc')}
						/>
						<span>浮动目录</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.progressBar}
							on:change={() => handleToggle('progressBar')}
						/>
						<span>进度条</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.floatingPlayer}
							on:change={() => handleToggle('floatingPlayer')}
						/>
						<span>悬浮播放器</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.animations}
							on:change={() => handleToggle('animations')}
						/>
						<span>所有动画</span>
					</label>
					<label class="setting-item">
						<input 
							type="checkbox" 
							checked={settings.pageCovers}
							on:change={() => handleToggle('pageCovers')}
						/>
						<span>文章封面</span>
					</label>
				</div>

				<div class="panel-actions">
					<button class="action-btn disable-all" on:click={disableAll}>
						关闭全部特效
					</button>
					<button class="action-btn enable-all" on:click={enableAll}>
						启用全部特效
					</button>
					<button class="action-btn reset" on:click={resetToDefault}>
						恢复默认
					</button>
				</div>
			</div>

			<div class="panel-footer">
				<small>设置已自动保存</small>
			</div>
		</div>
	{/if}
</div>

<style>
	.performance-control {
		position: fixed;
		right: 2rem;
		bottom: 2rem;
		z-index: 999;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
	}

	.performance-btn {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: var(--primary, #0066cc);
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;
		font-size: 20px;
	}

	.performance-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.performance-btn:active {
		transform: scale(0.95);
	}

	.icon {
		width: 24px;
		height: 24px;
	}

	.performance-panel {
		position: absolute;
		right: 0;
		bottom: calc(100% + 1rem);
		background: var(--bg-color, #ffffff);
		border: 1px solid var(--border-color, #e5e7eb);
		border-radius: 12px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
		width: 280px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	:global(.dark) .performance-panel {
		background: var(--bg-color, #1f2937);
		border-color: var(--border-color, #374151);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
		background: linear-gradient(135deg, var(--primary, #0066cc)15%, var(--primary-light, #0080ff)100%);
		color: white;
	}

	:global(.dark) .panel-header {
		border-color: var(--border-color, #374151);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
	}

	.close-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 18px;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s;
	}

	.close-btn:hover {
		transform: scale(1.2);
	}

	.panel-content {
		padding: 1rem;
		max-height: 400px;
		overflow-y: auto;
	}

	.settings-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.setting-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		font-size: 13px;
		color: var(--text-color, #374151);
		transition: color 0.2s;
	}

	:global(.dark) .setting-item {
		color: var(--text-color, #d1d5db);
	}

	.setting-item:hover {
		color: var(--primary, #0066cc);
	}

	.setting-item input[type="checkbox"] {
		cursor: pointer;
		width: 16px;
		height: 16px;
		accent-color: var(--primary, #0066cc);
	}

	.panel-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	:global(.dark) .panel-actions {
		border-color: var(--border-color, #374151);
	}

	.action-btn {
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn.disable-all {
		background: #ef4444;
		color: white;
	}

	.action-btn.disable-all:hover {
		background: #dc2626;
	}

	.action-btn.enable-all {
		background: #10b981;
		color: white;
	}

	.action-btn.enable-all:hover {
		background: #059669;
	}

	.action-btn.reset {
		background: var(--border-color, #e5e7eb);
		color: var(--text-color, #374151);
	}

	.action-btn.reset:hover {
		background: var(--border-color, #d1d5db);
	}

	:global(.dark) .action-btn.reset {
		background: var(--border-color, #4b5563);
		color: var(--text-color, #d1d5db);
	}

	:global(.dark) .action-btn.reset:hover {
		background: var(--border-color, #6b7280);
	}

	.panel-footer {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border-color, #e5e7eb);
		text-align: center;
		font-size: 11px;
		color: var(--text-color-secondary, #9ca3af);
		background: var(--bg-secondary, #f9fafb);
	}

	:global(.dark) .panel-footer {
		background: var(--bg-secondary, #111827);
		border-color: var(--border-color, #374151);
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.performance-control {
			right: 1rem;
			bottom: 1rem;
		}

		.performance-btn {
			width: 44px;
			height: 44px;
		}

		.performance-panel {
			width: 240px;
			bottom: calc(100% + 0.5rem);
		}

		.panel-content {
			max-height: 300px;
		}
	}
</style>
