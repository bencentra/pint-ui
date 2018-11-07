const { ipcRenderer } = require('electron');
const Mustache = require('mustache');
const debug = require('../debug');
const log = debug('SelectFile');

// Mustache template for a recipe
const template = `
<div class="pint-recipe">
  <div class="pint-recipe-header">
    <h2>{{data.name}}</h2>
    <ul>
      <li>Batch Size: {{data.size}}{{data.unit}}</li>
      <li>Style: {{data.style}}</li>
    </ul>
  </div>
  <div class="pint-recipe-ingredients">
    <div class="pint-recipe-ingredient">
      <h3>Fermentables</h3>
      <table>
        <tr><th>Name</th><th>Amount</th></tr>
        {{#ingredients.fermentables}}
        {{{methods.fermentable}}}
        {{/ingredients.fermentables}}
      </table>
    </div>
    <div class="pint-recipe-ingredient">
      <h3>Hops</h3>
      <table>
        <tr><th>Name</th><th>Amount</th><th>Time</th></tr>
        {{#ingredients.hops}}
        {{{methods.hopOrMisc}}}
        {{/ingredients.hops}}
      </table>
    </div>
    {{#hasMisc}}
    <div class="pint-recipe-ingredient">
      <h3>Miscellaneous</h3>
      <table>
        <tr><th>Name</th><th>Amount</th><th>Time</th></tr>
        {{#ingredients.misc}}
        {{{methods.hopOrMisc}}}
        {{/ingredients.misc}}
      </table>
    </div>
    {{/hasMisc}}
    <div class="pint-recipe-ingredient">
      <h3>Yeast</h3>
      {{#ingredients.yeast}}
      {{{methods.yeast}}}
      {{/ingredients.yeast}}
    </div>
  </div>
  <div
</div>
`;

// Mustache template functions, context will be bound correctly
function fermentable() {
  return `<tr><td>${this.name}</td><td>${this.amount} ${this.unit}</td></tr>`;
}
function hopOrMisc() {
  return `<tr><td>${this.name}</td><td>${this.amount} ${this.unit}</td><td>${this.time}</td></tr>`;
}
function yeast() {
  return `<p>${this.name} (${this.brand})</p>`;
}

const fileSelectBtn = document.getElementById('pint-file-select');
const fileName = document.getElementById('pint-file-name');
const recipeZone = document.getElementById('pint-recipe');
const batchSizeInput = document.getElementById('pint-batch-size');
const recipeOutput = document.getElementById('pint-recipe-target');
const refillBtn = document.getElementById('pint-refill');

fileSelectBtn.addEventListener('click', (event) => {
  const batchSize = parseFloat(batchSizeInput.value);
  log('selecting recipe', batchSize);
  ipcRenderer.send('select-recipe', batchSize);
});

ipcRenderer.on('recipe-selected', (event, recipe) => {
  log('recipe selected', recipe, event);
  const mustacheRecipe = Object.assign({}, recipe, {
    hasMisc: recipe.ingredients.misc && recipe.ingredients.misc.length > 0,
    methods: {
      fermentable,
      hopOrMisc,
      yeast
    }
  });
  recipeOutput.innerHTML = Mustache.render(template, mustacheRecipe);
  recipeZone.style.display = 'block';
  fileName.style.display = 'block';
  fileName.innerHTML = recipe.data.name;
  fileSelectBtn.style.display = 'none';
});

refillBtn.addEventListener('click', (event) => {
  window.scrollTo(0, 0);
  fileName.style.display = 'none';
  fileSelectBtn.style.display = 'block';
});
