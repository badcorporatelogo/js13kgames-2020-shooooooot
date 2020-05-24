// global volume setting
export var volume = 0.1;

// store volume while muted
var oldVolume = volume;

export function mute() {
  oldVolume = volume;
  volume = 0;
}

export function unmute() {
  volume = oldVolume;
}
