const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const pint = require('@bencentra/pint');

const parseRecipe = (path, batchSize) => {
  const file = fs.readFileSync(path, 'utf8');
  const recipe = pint(file, batchSize);
  return recipe;
};

ipcMain.on('select-recipe', (event, batchSize) => {
  console.log('select-recipe', batchSize);
  const options = {
    properties: ['openFile'],
    filters: [{
      name: 'XML Files',
      extensions: ['xml']
    }]
  };
  dialog.showOpenDialog(options, (files) => {
    if (files) {
      const recipe = parseRecipe(files[0], batchSize);
      event.sender.send('recipe-selected', recipe);
    }
  })
});

ipcMain.on('open-error-dialog', (event) => {
  dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
});