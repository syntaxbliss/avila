import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export default class PDFService {
  private downloadsDir: string;
  private downloadsBaseUrl: string;

  constructor() {
    this.downloadsDir = path.join(__dirname, '..', 'assets', 'download');
    this.downloadsBaseUrl = `${process.env.APP_SERVER_URL}:${process.env.APP_PORT}/download`;
  }

  async generatePDF(filename: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const downloadFilename = `${filename}.pdf`;
    await page.goto(`${this.downloadsBaseUrl}/${filename}.html`, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: path.join(this.downloadsDir, downloadFilename),
      format: 'A4',
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
      printBackground: true,
    });
    await browser.close();

    fs.unlinkSync(`${this.downloadsDir}/${filename}.html`);

    return `${this.downloadsBaseUrl}/${downloadFilename}`;
  }
}
