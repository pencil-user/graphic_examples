import { tabs } from "./tabs";
//import { makeDoublyLinkedList } from "./utils";

function init() {
    tabs('index2');
    const form = document.querySelector("form");
    form?.addEventListener("submit", submitHandler);
    console.log('the second one')
    /*
    const myList = makeDoublyLinkedList('Donald')
    myList.append('Lawrence')
    myList.append('Hannah')
    myList.append('Uriel')
    myList.reset()
    myList.append('Bojan')
    console.log(myList.print())
    */
  }

export function submitHandler(e: Event) {
    e.preventDefault();
    const num1 = document.querySelector("input[name='firstnumber']") as HTMLInputElement;
    const num2 = document.querySelector("input[name='secondnumber']") as HTMLInputElement;
    const result = Number(num1.value) - Number(num2.value);
    const resultElement = document.querySelector("p");
    if (resultElement) {
      resultElement.textContent = result.toString();
    }
  }

  init();