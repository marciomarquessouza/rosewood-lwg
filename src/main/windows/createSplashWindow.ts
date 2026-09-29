import { BrowserWindow } from "electron";
import fs from "node:fs";
import path from "node:path";

export function createSplashWindow() {
  const imagePath = path.join(process.cwd(), "src/assets/images/splash.png");

  const image = fs.readFileSync(imagePath);
  const imageSrc = `data:image/png;base64,${image.toString("base64")}`;

  const splashWindow = new BrowserWindow({
    width: 682,
    height: 291,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
  });

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          html,
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #000;
          }

          img {
            display: block;
            width: 682px;
            height: 291px;
          }
        </style>
      </head>

      <body>
        <img src="${imageSrc}" />
      </body>
    </html>
  `;

  splashWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
  );

  return splashWindow;
}
