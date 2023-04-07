import mySettings from '../mySettings.json'

export function tabs(active: string) {
  const linkBox = document.querySelector("#linkBox") as HTMLDivElement
  mySettings.map((value) => {
    if (value.name === active) {
      const a = document.createElement('span')
      a.innerText = value.label
      linkBox.appendChild(a)
      linkBox.appendChild(document.createTextNode(' | '))
    } else {
      const a = document.createElement('a')
      a.innerText = value.label
      a.setAttribute('href', `${value.name}.html`);
      linkBox.appendChild(a)
      linkBox.appendChild(document.createTextNode(' | '))
    }
  })
}