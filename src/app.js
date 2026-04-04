const nbBox = 6;
const container = document.getElementById("list-workout");
for (let i = 1; i < nbBox; i++) {
    const button = document.createElement('button');
    button.classList.add('btn','btn-primary', 'my-3');
    button.innerText = 'Workout ' + i;
    button.onclick = () => {console.log(i)}
    container.appendChild(button);
}