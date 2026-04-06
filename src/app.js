// menu page
const main = document.getElementById('main-content');
function displayMenu(){
    main.innerHTML = `<div class="text-center py-2">
      <h1>MMA in pure JS</h1>
    </div>

    <div id="list-workout" class="d-grid gap-2 py-2 w-75 mx-auto">
    </div>

    <footer class="container text-center fixed-bottom py-4">
      <div class="row">
        <div class="col">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-graph-up-arrow" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
          </svg>
        </div>
        <div class="col">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-sliders2" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
          </svg>
        </div>
      </div>
    </footer>`
}
displayMenu();
// workout list buttons
const nbBox = 6;
const container = document.getElementById("list-workout");
for (let i = 1; i < nbBox; i++) {
    const button = document.createElement('button');
    button.classList.add('btn','btn-primary', 'my-3');
    button.innerText = 'Workout ' + i;
    button.onclick = () => {console.log(i)}
    container.appendChild(button);
}

