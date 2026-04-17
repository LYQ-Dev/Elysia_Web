import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../');

const sourceDir = path.join(projectRoot, 'src/content/diary');
const destDir = path.join(projectRoot, 'public/diary-content');

// 创建目标目录
if (!fs.existsSync(destDir)) {
	fs.mkdirSync(destDir, { recursive: true });
}

// 递归复制图片
function copyImages(source, destination) {
	if (!fs.existsSync(source)) return;

	const files = fs.readdirSync(source);
	for (const file of files) {
		const sourcePath = path.join(source, file);
		const destPath = path.join(destination, file);
		const stat = fs.statSync(sourcePath);

		if (stat.isDirectory()) {
			if (!fs.existsSync(destPath)) {
				fs.mkdirSync(destPath, { recursive: true });
			}
			copyImages(sourcePath, destPath);
		} else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) {
			fs.copyFileSync(sourcePath, destPath);
			console.log(`✓ Copied ${file}`);
		}
	}
}

console.log('🖼️  Syncing diary images to public directory...');
copyImages(sourceDir, destDir);
console.log('✅ Diary images synced successfully!');
