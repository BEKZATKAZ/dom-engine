let music: HTMLAudioElement;

document?.addEventListener("pointerdown", () => {
  music ??= document.querySelector<HTMLAudioElement>("#music")!;
  if (music.paused) music.play();
});
