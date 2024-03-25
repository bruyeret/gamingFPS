import { startPlaying } from './game';
import './style.css'
import logo from '/favicon.ico'

const appDiv = document.querySelector<HTMLDivElement>('#app')!;
appDiv.innerHTML = `
  <div>
    <img src="${logo}" class="logo" alt="Vite logo" />
    <h1>Coucou, c'est l'heure du gaming</h1>
    <button id="playButton">Jouer</button>
  </div>
`;

const playButton = document.querySelector<HTMLButtonElement>('#playButton')!;
playButton.addEventListener("click", () => {
  const mainCanvasId = "mainCanvas";
  appDiv.innerHTML = `
  <canvas id="${mainCanvasId}"></canvas>
`;
  const mainCanvas = document.querySelector<HTMLCanvasElement>(`#${mainCanvasId}`)!;
  startPlaying(mainCanvas);
});
