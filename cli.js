#!/usr/bin/env node
var fs = require('fs');
var chalk = require('chalk');
var path = require('path');
var {checkCmdLine, aorCreate, aorEdit, aorList, aorShow} = require('./fn')

var cl = checkCmdLine();

if (cl.valid && cl.operation === 'create') {
  if (!fs.existsSync(cl.module_name)) {
    fs.mkdirSync(cl.module_name);
    console.log(chalk.green.bold('|--' + cl.module_name));
    fs.appendFile(cl.module_name + '/index.js', aorIndex(cl.add), function(err) {
      if (err) throw err;
      console.log(chalk.green('\t|-- index.js'));
    });
    cl.add.map((filename, index) => {
      let condition = aor(filename);
      if (condition !== null) {
        fs.appendFile(cl.module_name + '/' + filename + '.js', aor(filename), err => {
          if (err) throw err;
          console.log(chalk.green('\t|-- ' + filename + '.js'));
        });
      }

      if (index === cl.add.length - 1)
        setTimeout(function() {
          let listProp = cl.add.indexOf('List') > -1 ? `list={${cl.module_name}.List}` : '';
          let editProp = cl.add.indexOf('Edit') > -1 ? `edit={${cl.module_name}.Edit}` : '';
          let createProp = cl.add.indexOf('Create') > -1 ? `create={${cl.module_name}.Create}` : '';
          let showProp = cl.add.indexOf('Show') > -1 ? `show={${cl.module_name}.Show}` : '';
          console.log(
            chalk.yellow(`
              /// COPY THIS RESULT TO YOU MAIN MODULE ///\n\n\n
              import ${cl.module_name} from 'path/to/${cl.module_name}';\n
              <Resource name="${cl.module_name}" ${listProp} ${editProp} ${createProp} ${showProp}/> `)
          );
        }, 1000);
    });
  } else {
    console.log(chalk.red(cl.module_name + ' ALREADY EXIST...'));
  }
} else if (cl.valid && cl.operation === 'update') {
  console.log(chalk.green.bold('|--' + cl.module_name));
  fs.appendFile(cl.module_name + '/index.js', aorIndex(cl.add), function(err) {
    if (err) throw err;
    console.log(chalk.green('\t|-- index.js'));
  });
  cl.add.map((filename, index) => {
    if (aor(filename)) {
      fs.appendFile(cl.module_name + '/' + filename + '.js', aor(filename), function(err) {
        if (err) throw err;
        console.log(chalk.green('\t|-- ' + filename + '.js'));
      });
    }

    if (index === cl.add.length - 1)
      setTimeout(function() {
        let listProp = cl.add.indexOf('List') > -1 ? `list="${cl.module_name}.List"` : '';
        let editProp = cl.add.indexOf('Edit') > -1 ? `edit="${cl.module_name}.Edit"` : '';
        let createProp = cl.add.indexOf('Create') > -1 ? `create="${cl.module_name}.Create"` : '';
        let showProp = cl.add.indexOf('Show') > -1 ? `show="${cl.module_name}.Show"` : '';
        console.log(
          chalk.yellow.bold(`
              /// COPY THIS RESULT TO YOU MAIN MODULE ///\n\n\n\n\n
              import ${cl.module_name} from 'path/to/${cl.module_name}';\n
              <Resource name="${cl.module_name}" ${listProp} ${editProp} ${createProp} ${showProp}/> `)
        );
      }, 1000);
  });
} else {
  console.log(cl.message, '\n\n', cl, '\n\n');
}

function aorIndex(subModules) {
  let _imports = subModules.map(subModule => `import ${subModule} from './${subModule}';`).join('\n');
  let _exports = '\nexport default { ' + subModules.join(', ') + ' };';
  return _imports.concat(_exports);
}

function aor(moduleName) {
  let output = null;
  if (moduleName === 'Create') {
    output = aorCreate(cl.src);
  }
  if (moduleName === 'List') {
    output = aorList(cl.src);
  }
  if (moduleName === 'Show') {
    output = aorShow(cl.src);
  }
  if (moduleName === 'Edit') {
    output = aorEdit(cl.src);
  }
  return output;
}