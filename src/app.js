const DB_NAME = "file_storage";
const STORE_NAME = "user_file";

function init() {
    getUserWorkoutFromDB()
    .then(value => {
        if(value){
            displayMenu(value.workout);
        }else{
            fetch('./workout.json')
            .then(response => response.json()
                .then(json => displayMenu(json)))
            .catch(error => alert(error));
        }
    })
    .catch(error => alert(error));
}

function createDB(){
    return new Promise((resolve,reject)=>{
        const request = indexedDB.open(DB_NAME, 2);
        request.onupgradeneeded = function(e) {
          const db = e.target.result;
          if(!db.objectStoreNames.contains(STORE_NAME)){
              db.createObjectStore(STORE_NAME, { keyPath: "id"});
          }
        };
        request.onerror = function(e) {
            reject(e.target.error);
        };
        request.onsuccess = function(e) {
            resolve(e.target.result);
        };
    });
}

function addToDB(data){
    createDB()
    .then(db =>{
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(data);
        request.onerror = function(e) {
            console.error(e.target.error);
            alert("Import failed!");
        }
        request.onsuccess = function() {
            init();
        }
    })
    .catch(error => alert(error));
}

function removeFromDB(){
    createDB().then(db =>{
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(0);
        request.onerror = function(e) {
            console.error(e.target.error);
        }
        request.onsuccess = function() {
            init();
        }
    })
    .catch(error => alert(error));
}

function getUserWorkoutFromDB(){
    return createDB().then(db =>{
        return new Promise((resolve,reject)=>{
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(0);
            request.onerror = function(e) {
                console.error(e.target.error);
                reject(e.target.error);
            }
            request.onsuccess = function() {
                const result = request.result;
                resolve(result !== undefined ? result : false);
            }
        })
    });
}

function displayMenu(workouts) {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div id="secondary-content">
        <div class="text-center py-2">
          <h1>MMA</h1>
        </div>
        <div id="list-workouts" class="d-grid gap-2 py-2 w-75 mx-auto"></div>
    </div>
    <footer class="container text-center fixed-bottom py-4">
      <div class="row">
        <div class="col">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-graph-up-arrow" viewBox="0 0 16 16" id="menu-btn">
            <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
          </svg>
        </div>
        <div class="col">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-sliders2" viewBox="0 0 16 16" id="settings-btn">
            <path fill-rule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
          </svg>
        </div>
      </div>
    </footer>`
    addButton(workouts, main);
    const menuBtn = document.getElementById('menu-btn');
    menuBtn.onclick = () => {
        displayMenu(workouts);
    };
    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn.onclick = () => {
        displaySettings(document.getElementById('secondary-content'));
    };
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

function displaySettings(secondary){
    secondary.innerHTML = `<h1 class="text-center py-2">Réglages</h1>
    <div class="container mb-5">
        <h2 class="py-1">Téléchargement</h2>
        <p>Le <strong>model.json</strong> est la structure de base du fichier qu'il faut importer.</p>
        <p>Le <strong>tutoriel.md</strong> est le guide pour remplir ce fichier selon les besoins.</p>
        <a href="data/model.json" download="model.json">model.json</a>
        <a href="data/tutorial.md" download="tutoriel.md">tutoriel.md</a>
    </div>
    <div class="container mb-5">
        <h2 class="py-1">Importation</h2>
        <div class="mb-3">
          <label for="formFile" class="form-label">Importe le fichier <strong>.json</strong></label>
          <input class="form-control" type="file" id="formFile" accept=".json" placeholder="myProgram.json" onchange="importUserWorkout(this)">
        </div>
    </div>
    <div class="container mb-5">
        <h2 class="py-1">Réinitialiser</h2>
        <p>Pour revenir à la version de base (programme par défaut).</p>
        <button class="btn btn-primary" onclick="removeFromDB()">Reset</button>
    </div>`;

}

function importUserWorkout(input){
    let file = input.files[0];
    if (file){
        const reader = new FileReader();
        let data;
        reader.onload = () => {
            data = reader.result;
            addToDB({id: 0, workout: JSON.parse(data)});
        };
        reader.onerror = () => {
            alert("Error: Loading file failed !")
        };
        reader.readAsText(file);
    }
}

function displayWorkout(workout, main) {
    main.innerHTML = `<button type="button" class="btn-close mt-3 ms-3" aria-label="Close" onclick="init()"></button>
    <h1 id="workout-name" class="my-3 text-center">${workout.nom}</h1>
    <div class="card card-body mx-3 mt-5 text-center" id="workout-area">
        <h2 id="workout-exercise" class="mb-5">Pompes</h2>
        <h5 id="workout-serie" class="mb-2">Séries: 3</h5>
        <h5 id="workout-repetition" class="mb-2">Répetitions: 15 secondes</h5>
        <h5 id="workout-recuperation" class="mb-5">Récuperation: 1 seconde</h5>
        <p id="workout-advice" class="mb-5 fs-4">Gainage</p>
        <button class="btn btn-primary fs-4" id="workout-begin">Démarrer</button>
        <div class="progress mb-5 mt-2" style="height: 2em" id="workout-progress-div">
          <div class="progress-bar" role="progressbar" style="width: 0%; height: 2em" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="workout-progress-bar"></div>
        </div>
        <button class="btn btn-primary fs-5" id="workout-next">Suivant</button>
    </div>`
    const workoutProperties = {
        area: document.querySelector('#workout-area'),
        exercise: document.querySelector('#workout-exercise'),
        serie: document.querySelector('#workout-serie'),
        repetition: document.querySelector('#workout-repetition'),
        recuperation: document.querySelector('#workout-recuperation'),
        advice: document.querySelector('#workout-advice'),
        beginBtn: document.querySelector('#workout-begin'),
        progressDiv: document.querySelector('#workout-progress-div'),
        progressBar: document.querySelector('#workout-progress-bar'),
        nextBtn: document.querySelector('#workout-next'),
        indexExercise: 0,
        indexSerie: 0,
    };
    workoutProperties.nextBtn.onclick = () => {
        workoutProperties.indexSerie++;
        initTimer(workout, workoutProperties, 3);
    };

    workoutProperties.beginBtn.onclick = () => {
        initTimer(workout, workoutProperties, 2);
    };

    updateWorkout(workout, workoutProperties);
}

function updateWorkout(workout, workoutProperties) {
    if (workoutProperties.indexSerie === workout.exercices[workoutProperties.indexExercise][1]) {
        workoutProperties.indexExercise++;
        workoutProperties.indexSerie = 0;
    }

    if (workoutProperties.indexExercise >= workout.exercices.length){
        workoutProperties.area.innerHTML = `<h1 class="my-3 text-center">Bravo !</h1>`;
    }else{
        if(typeof(workout.exercices[workoutProperties.indexExercise][2]) === 'string'){
            workoutProperties.beginBtn.hidden = false;
            workoutProperties.beginBtn.disabled = false;
            workoutProperties.nextBtn.disabled = true;
        }else{
            workoutProperties.beginBtn.hidden = true;
            workoutProperties.beginBtn.disabled = true;
            workoutProperties.nextBtn.disabled = false;
        }

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

function initTimer(workout, workoutProperties, index){
    workoutProperties.nextBtn.disabled = true;
    workoutProperties.beginBtn.disabled = true;
    let start = new Date().getTime();
    let value = workout.exercices[workoutProperties.indexExercise][index];
    let end = (typeof(value) !== 'string' ? value: value.substring(0, value.length - 1))*1000;

    let timer = setInterval(() => {
        let delta = new Date().getTime() - start;
        if(delta >= end){
            if (typeof(value) === 'string'){
                workoutProperties.beginBtn.hidden = true;
                workoutProperties.beginBtn.disabled = false;
                workoutProperties.nextBtn.disabled = false;
            }else{
                updateWorkout(workout, workoutProperties);
            }
            workoutProperties.progressBar.style.width = `0%`;
            workoutProperties.progressBar.ariaValueNow = `0`;
            workoutProperties.progressBar.innerText = ``;
            clearInterval(timer);
        }else{
            let value = Math.round(delta/end * 100);
            workoutProperties.progressBar.style.width = `${value}%`;
            workoutProperties.progressBar.ariaValueNow = `${value}`;
            workoutProperties.progressBar.innerText = `${Math.round(delta/1000)} s`;
        }
    }, 20);
}

init();