// Easy access to DOM elements defined in index.html
export const renderArea = document.getElementById('render-area');

export default {
  createCanvas() {
    return document.createElement('canvas');
  }
}

export function showCursor() {
  renderArea.classList.remove('hidecursor');
  renderArea.classList.add('showcursor');
}

export function hideCursor() {
  renderArea.classList.remove('showcursor');
  renderArea.classList.add('hidecursor');
}
