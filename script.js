/**
 * STEPS:
 *
 * 1. Extract all selectors, create helper functions
 * 2. Read through the API's documentation and understand what needs to be included in the params of the request,
 *    create a generic params object
 * 3. Register event listeners, fetch the data per the user's input
 * 4. Output results to the UI (success and error)
 * 5. Adjust UI states accordingly
 */
  // Extracts all selectors //
 const submitButton = document.querySelector('#submit');// boutton search
 const input = document.querySelector('#input');// input 
 const errorSpan = document.querySelector('#error');// text d'erreur
 const resultsContainer = document.querySelector('#results');// container de resultats
 
 // STEP 2 //
 const endpoint = 'https://en.wikipedia.org/w/api.php?';
 const params = {
     origin: '*',
     format: 'json',
     action: 'query',

     prop: 'extracts', // pour pouvoir extraire le texte de l'article ou une partie
     exchars: 250, // le nombre de caractere a afficher dans la card
     exintro: true, //retourne uniquement le contenu avant la 1ere section
     explaintext: true,//renvoie des extraits sous forme de texte au lieu de code HTML
     generator: 'search',// obtenir la liste des pages sur lesquelles travailler en exécutant le module de requête spécifié, PERFORME A FULL TEXT SEARCH wikipedia va nous donner tout ce qu'il possede sur notre recherche
     gsrlimit: 20, // le nombre de card de resultats a afficher
 };
 // END STEP 2 //

 //STEP1 create helper functions  //
 // disableUi() pour que lorsque nous tapons entrer dans la recherche l'input et le bouton recherche doivent etre desactiver
 const disableUi = () => {
     input.disabled = true;
     submitButton.disabled = true;
 };
 
 // enableUi() comme nous avons une fonction qui desactive l'input et le bouton search nous devons invoquer une autre fonction qui va reactiver l'input et le submit boutton.
 const enableUi = () => {
     input.disabled = false;
     submitButton.disabled = false;
 };
 
 // clearPreviousResults() permet de reinitialiser les resultats des recherches
 const clearPreviousResults = () => {
     resultsContainer.innerHTML = ''; 
     errorSpan.innerHTML = ''; // errorSpan parceque on ne sait pas si la nouvelle recherche sera une erreur ou pas pour plus de precaution il vaut mieux appeler la fonction errorSpan
 };
 
 // isInputEmpty() est une fonction qui permet de verifier si l'input file est vide avant de soumettre toute recherche...
 // if no input or input === '' return true
 // else return false
 const isInputEmpty = (input) => {
     if (!input || input === '') return true;
     return false;
     // cette fonction en d'autres termes permet de dire que si l'on tape quelque chose dans l'input et que l'on efface l'element taper cela n'efface pas tout l'input file mais plutot rend son string vide//
 };
 
 // fonction showError permet d'afficher le text erreur de recherche...
 const showError = error => {
     errorSpan.innerHTML = `🚨 ${error} 🚨`;
 };

 // END STEP 1 //
 
 // showresults permet d'afficher les differents resultats de notre recherche...
 const showResults = results => {
     results.forEach(result => {
         resultsContainer.innerHTML += `
         <div class="results__item">
             <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                 <h2 class="results__item__title">${result.title}</h2>
                 <p class="results__item__intro">${result.intro}</p>
             </a>
         </div>
     `;
     });
 };
 
 const gatherData = pages => {
     // nous stockons l'object.values(pages) dans une variable results
     const results = Object.values(pages).map(page => ({ // Object.values renvoie un tableau où chaque élément du tableau est la valeur de l'objet respectif
        // console.log(Object.values(pages))
         pageId: page.pageid,
         title: page.title,
         intro: page.extract,
     }));
     // ensuite nous appelons showresults avec comme parametre results...
     showResults(results); 
 };
 
 // STEP 3 fetch the data //
 // getData() permet de fetcher le data avec fetch oubien async await
 const getData = async () => {
     const userInput = input.value;
     if (isInputEmpty(userInput)) return;
 
     params.gsrsearch = userInput;
     clearPreviousResults(); // reinitialiser pour ne pas que les recherches se melange
     disableUi(); // parce qu'on a pas besoin de recherche multiple lorsqu'on a deja une recherche qui est en cour
 
     try { //try catch permet de verifier si la reponse est une erreur oubien va t'elle aboutir? 
         const { data } = await axios.get(endpoint, { params }); // javascript ne va pas attendre que wikipedia lui fourni des resultats pour les afficher il le fais de lui meme et ensuite attend la requete, Nous stockons ce qui a été retouner comme reponse dans la variale data,
         // la reponse peut aboutir comme sa peut etre une erreur dans tous les cas il doit attendre la requete pour le moment
 
         if (data.error) throw new Error(data.error.info); // si c'est une erreur elle doit afficher le message de l'erreur
         gatherData(data.query.pages); // 
     } catch (error) {
         showError(error);
     } finally { // designe que nous sommes a la fin du try catch
         enableUi();
     }
 };
 
 const handleKeyEvent = (e) => {
     if (e.key === 'Enter') { // lorsque l'on clique sur Enter activer getData();
         getData();
     }
 };
 
 // STEP 3 event listener //
 const registerEventHandlers = () => {
     input.addEventListener('keydown', handleKeyEvent);
     submitButton.addEventListener('click', getData); // lorsque l'on clique sur le boutton search activer getData()
 };
 
 registerEventHandlers();   