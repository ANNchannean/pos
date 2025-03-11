import * as fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { encodeBase32LowerCase } from '@oslojs/encoding';
const location = 'static/uploads';
function generateRandomId(bytes: number): string {
	const randomBytes = crypto.getRandomValues(new Uint8Array(bytes));
	return encodeBase32LowerCase(randomBytes);
}
export async function uploadFile(file: File) {
	if (!file?.size) return;
	try {
		const uniqueId = generateRandomId(20);
		const fileExtension = file.type.split('/')[1];
		if (!['jpeg', 'png'].includes(fileExtension)) throw new Error('Unsupported file type');
		// Create folder name based on current year and month
		const date = new Date();
		const folderName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		// Create the folder if it doesn't exist
		const folderPath = path.join(process.cwd(), location, folderName);
		await fs.mkdir(folderPath, { recursive: true });
		const filePath = path.join(folderPath, `${uniqueId}.${fileExtension}`);
		const arrayBuffer = await file.arrayBuffer();
		const optimizedBuffer = await sharp(Buffer.from(arrayBuffer))
			.resize(1000)
			.jpeg({ progressive: true, force: false, quality: 50 })
			.png({ progressive: true, force: false, quality: 50 })
			.toBuffer();

		await fs.writeFile(filePath, optimizedBuffer);
		return `${folderName}/${uniqueId}.${fileExtension}`;
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
}
export async function updateFile(file: File, oldFileName: string) {
	if (!file.size) return;
	await deleteFile(oldFileName);
	return await uploadFile(file);
}

export async function deleteFile(fileName: string): Promise<void> {
	if (!fileName) return;
	try {
		const filePath = path.join(process.cwd(), location, fileName);
		await fs.unlink(filePath);
		// Remove empty folder if it exists
		const folderPath = path.dirname(filePath);
		const files = await fs.readdir(folderPath);
		if (files.length === 0) {
			await fs.rmdir(folderPath);
		}
	} catch (error) {
		console.error('Error deleting file:', error);
	}
}
export async function getBuffer(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	return Buffer.from(arrayBuffer).toString('base64');
}
