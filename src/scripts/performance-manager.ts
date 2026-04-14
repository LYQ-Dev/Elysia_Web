/**
 * Performance Manager Script
 * 管理性能设置的应用和持久化
 */

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

class PerformanceManager {
	private static instance: PerformanceManager;
	private settings: PerformanceSettings;
	private observers: Set<(settings: PerformanceSettings) => void> = new Set();

	private constructor() {
		this.settings = this.loadSettings();
		this.applySettings();
		this.setupEventListeners();
	}

	static getInstance(): PerformanceManager {
		if (!PerformanceManager.instance) {
			PerformanceManager.instance = new PerformanceManager();
		}
		return PerformanceManager.instance;
	}

	private loadSettings(): PerformanceSettings {
		const defaultSettings: PerformanceSettings = {
			waveEffect: true,
			carousel: true,
			typewriter: true,
			floatingToc: true,
			progressBar: true,
			floatingPlayer: true,
			animations: true,
			pageCovers: true,
		};

		try {
			const saved = localStorage.getItem('performanceSettings');
			if (saved) {
				return { ...defaultSettings, ...JSON.parse(saved) };
			}
		} catch (e) {
			console.warn('Failed to load performance settings:', e);
		}

		return defaultSettings;
	}

	private saveSettings(): void {
		try {
			localStorage.setItem('performanceSettings', JSON.stringify(this.settings));
		} catch (e) {
			console.warn('Failed to save performance settings:', e);
		}
	}

	applySettings(): void {
		const root = document.documentElement;

		// 设置data属性
		root.setAttribute('data-wave-effect', this.settings.waveEffect ? 'true' : 'false');
		root.setAttribute('data-carousel', this.settings.carousel ? 'true' : 'false');
		root.setAttribute('data-typewriter', this.settings.typewriter ? 'true' : 'false');
		root.setAttribute('data-floating-toc', this.settings.floatingToc ? 'true' : 'false');
		root.setAttribute('data-progress-bar', this.settings.progressBar ? 'true' : 'false');
		root.setAttribute('data-floating-player', this.settings.floatingPlayer ? 'true' : 'false');
		root.setAttribute('data-page-covers', this.settings.pageCovers ? 'true' : 'false');

		// 隐藏/显示元素
		this.toggleVisible('.waves', this.settings.waveEffect);
		this.toggleVisible('.floating-toc, #toc-floating', this.settings.floatingToc);
		this.toggleVisible('.page-progress-bar', this.settings.progressBar);
		this.toggleVisible('.music-player-floating', this.settings.floatingPlayer);
		this.toggleVisible('.article-cover, .post-cover', this.settings.pageCovers);

		// 控制动画
		if (!this.settings.animations) {
			root.style.setProperty('--animation-duration', '0ms');
			root.style.setProperty('--transition-duration', '0ms');
		} else {
			root.style.removeProperty('--animation-duration');
			root.style.removeProperty('--transition-duration');
		}

		// 禁用轮播
		if (!this.settings.carousel) {
			this.disableCarousel();
		}

		// 禁用打字机
		if (!this.settings.typewriter) {
			this.disableTypewriter();
		}

		this.notifyObservers();
	}

	private toggleVisible(selector: string, show: boolean): void {
		try {
			const elements = document.querySelectorAll(selector);
			elements.forEach(el => {
				if (show) {
					el.classList.remove('hidden', 'display-none');
					(el as HTMLElement).style.display = '';
				} else {
					(el as HTMLElement).style.display = 'none';
				}
			});
		} catch (e) {
			console.warn(`Failed to toggle visibility for ${selector}:`, e);
		}
	}

	private disableCarousel(): void {
		// 停止轮播动画
		const carousels = document.querySelectorAll('[data-carousel], .carousel');
		carousels.forEach(carousel => {
			(carousel as HTMLElement).style.animationPlayState = 'paused';
		});
	}

	private disableTypewriter(): void {
		// 停止打字机动画
		const typewriters = document.querySelectorAll('.typewriter-text, [data-typewriter]');
		typewriters.forEach(typewriter => {
			(typewriter as HTMLElement).style.animationPlayState = 'paused';
		});
	}

	updateSettings(newSettings: Partial<PerformanceSettings>): void {
		this.settings = { ...this.settings, ...newSettings };
		this.saveSettings();
		this.applySettings();
	}

	getSettings(): PerformanceSettings {
		return { ...this.settings };
	}

	subscribe(callback: (settings: PerformanceSettings) => void): () => void {
		this.observers.add(callback);
		// 返回取消订阅函数
		return () => {
			this.observers.delete(callback);
		};
	}

	private notifyObservers(): void {
		this.observers.forEach(callback => callback(this.settings));
	}

	private setupEventListeners(): void {
		// 监听Svelte组件的自定义事件
		window.addEventListener('performanceSettingsChanged', (event: any) => {
			this.updateSettings(event.detail);
		});

		// 监听其他页面性能设置变化
		window.addEventListener('storage', (event: StorageEvent) => {
			if (event.key === 'performanceSettings') {
				this.settings = this.loadSettings();
				this.applySettings();
			}
		});
	}

	// 预设快捷方式
	disableAllEffects(): void {
		this.updateSettings({
			waveEffect: false,
			carousel: false,
			typewriter: false,
			floatingToc: false,
			progressBar: false,
			floatingPlayer: false,
			animations: false,
			pageCovers: false,
		});
	}

	enableAllEffects(): void {
		this.updateSettings({
			waveEffect: true,
			carousel: true,
			typewriter: true,
			floatingToc: true,
			progressBar: true,
			floatingPlayer: true,
			animations: true,
			pageCovers: true,
		});
	}

	resetToDefault(): void {
		try {
			localStorage.removeItem('performanceSettings');
			this.settings = this.loadSettings();
			this.applySettings();
		} catch (e) {
			console.warn('Failed to reset settings:', e);
		}
	}
}

// 初始化
if (typeof window !== 'undefined') {
	const manager = PerformanceManager.getInstance();

	// 暴露到window对象供外部使用
	(window as any).performanceManager = manager;

	// 在DOM加载完成后应用设置
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			manager.applySettings();
		});
	} else {
		manager.applySettings();
	}
}
