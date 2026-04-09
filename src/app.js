function init() {
    fetch('./workout.json')
        .then(response => response.json()
            .then(json => displayMenu(json)))
        .catch(error => alert(error));
}

function displayMenu(workouts) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div class="text-center py-2">
      <h1>MMA in pure JS</h1>
    </div>

    <div id="list-workouts" class="d-grid gap-2 py-2 w-75 mx-auto">
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
    addButton(workouts, main);
}

function addButton(workouts, main) {
    const nbWorkouts = workouts.length;
    const container = document.getElementById("list-workouts");
    for (let i = 0; i < nbWorkouts; i++) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'my-3');
        let workout = workouts[i];
        button.innerText = `${workout.nom} ${workout.jour !== "" ? `(${workout.jour})` : ""}`;
        button.onclick = () => {
            displayWorkout(workout, main);
        };
        container.appendChild(button);
    }
}

function displayWorkout(workout, main) {
    main.innerHTML = `<button type="button" class="btn-close mt-3 ms-3" aria-label="Close" onclick="init()"></button>
    <h1 id="workout-name" class="my-3 text-center">${workout.nom}</h1>
    <div class="card card-body mx-3 mt-5 text-center">
        <h2 id="workout-exercise" class="mb-5">Pompes</h2>
        <h5 id="workout-serie" class="mb-2">Séries: 3</h5>
        <h5 id="workout-repetition" class="mb-2">Répetitions: 15 secondes</h5>
        <h5 id="workout-recuperation" class="mb-5">Récuperation: 1 seconde</h5>
        <p id="workout-advice" class="mb-5 fs-4">Gainage</p>
        <button class="btn btn-primary fs-5" id="next-btn">Suivant</button>
    </div>`
    const workoutProperties = {
        exercise: document.querySelector('#workout-exercise'),
        serie: document.querySelector('#workout-serie'),
        repetition: document.querySelector('#workout-repetition'),
        recuperation: document.querySelector('#workout-recuperation'),
        advice: document.querySelector('#workout-advice'),
        indexExercise: 0,
        indexSerie: 0,
    };
    document.getElementById('next-btn').onclick = () => {
        workoutProperties.indexSerie++;
        updateWorkout(workout, main, workoutProperties);
    }
    updateWorkout(workout, main, workoutProperties);
}

function updateWorkout(workout, main, workoutProperties) {
    if (workoutProperties.indexSerie === workout.exercices[workoutProperties.indexExercise][1]) {
        workoutProperties.indexExercise++;
        workoutProperties.indexSerie = 0;
    }

    if (workoutProperties.indexExercise >= workout.exercices.length){
        main.innerHTML = `<button type="button" class="btn-close mt-3 ms-3" aria-label="Close" onclick="init()"></button>
        <h1 class="my-5 text-center">Bravo !</h1>`
    }else{
        let exercise = workout.exercices;
        let index = workoutProperties.indexExercise;
        workoutProperties.exercise.innerText = exercise[index][0];
        let value = exercise[index][1];
        workoutProperties.serie.innerText = `Série${value > 1 ? "s" : ""}: ${value}`;
        value = exercise[index][2]
        workoutProperties.repetition.innerText = `Répetition${(typeof (value) == "string" ? value.substring(0, value.length - 1) : value) > 1 ? "s" : ""}: ${typeof (value) == "string" ? `${value.substring(0, value.length - 1)} seconde${value.substring(0, value.length - 1) > 1 ? "s" : ""}` : value}`;
        value = exercise[index][3]
        workoutProperties.recuperation.innerText = `Récuperation: ${value} seconde${value > 1 ? "s" : ""}`;
        workoutProperties.advice.innerText = exercise[index][4];
    }
}

init();