var fs = require('fs');
var chalk = require('chalk');

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
          let listProp = cl.add.indexOf('List') > -1 ? `list="${cl.module_name}.List"` : '';
          let editProp = cl.add.indexOf('Edit') > -1 ? `edit="${cl.module_name}.Edit"` : '';
          let createProp = cl.add.indexOf('Create') > -1 ? `create="${cl.module_name}.Create"` : '';
          let showProp = cl.add.indexOf('Show') > -1 ? `show="${cl.module_name}.Show"` : '';
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
    output = aorCreate();
  }
  if (moduleName === 'List') {
    output = aorList();
  }
  if (moduleName === 'Show') {
    output = aorShow();
  }
  if (moduleName === 'Edit') {
    output = aorEdit();
  }
  return output;
}

function aorCreate() {
  items = cl.src.map(src => `<TextInput source="${src}" />`).join('\n\t');

  return `
import React from 'react';
import {
  Create,
  TextInput,
  SimpleForm
} from 'admin-on-rest';

export default props => (
  <Create {...props} >
    <SimpleForm>
    ${items}
    </SimpleForm>
  </Create>
);
  `;
}
function aorShow() {
  items = cl.src.map(src => `<TextField source="${src}" />`).join('\n\t');
  return `
import React from 'react';
import { SimpleShowLayout, Show, TextField } from 'admin-on-rest';

export default props => (
  <Show {...props}>
    <SimpleShowLayout>
    ${items}
    </SimpleShowLayout>
  </Show>
);
  `;
}
function aorEdit() {
  items = cl.src.map(src => `<TextInput source="${src}" />`).join('\n\t');

  return `
  import React from 'react';
  import {
    Edit,
    TextInput,
    SimpleForm
  } from 'admin-on-rest';

  export default props => (
    <Edit {...props} >
      <SimpleForm>
      ${items}
      </SimpleForm>
    </Edit>
  );
    `;
}

function aorList() {
  items = cl.src.map(src => `<TextField source="${src}" />`).join('\n\t');
  return `
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
} from 'admin-on-rest';

export default props => (
  <List {...props} >
        <Datagrid>
        ${items}
        </Datagrid>
  </List>
);
`;
}

function checkCmdLine() {
  var output = [];
  var response = {};
  var cl = process.argv.slice(2);

  var chkcr = cl[0] === 'create';
  var chkup = cl[0] === 'update';
  output.push({
    level: 1,
    status: chkcr || chkup,
    err: 'synthax error: "create" or "update" command not found...'
  });

  var chkmodulename = cl[1] !== undefined && cl[1] !== 'create' && cl[1] !== 'update' && cl[1] !== 'add';

  output.push({
    level: 2,
    status: chkmodulename,
    err: 'synthax error: wrong or invalid module name...'
  });

  var chkadd = cl[2] === 'add';

  output.push({
    level: 3,
    status: chkadd,
    err: 'synthax error: prefix "add" not found...'
  });

  var chkadddata = cl.indexOf('sources') > -1 ? cl.slice(3, cl.indexOf('sources')) : cl.slice(3, cl.length);

  var validadds = true;
  for (var i = 0; i < chkadddata.length; i++) {
    if (!['Create', 'Edit', 'Show', 'List'].includes(chkadddata[i])) {
      validadds = false;
      break;
    }
  }

  output.push({
    level: 4,
    status: chkadddata.length > 0 && chkadd && validadds,
    err: 'missing or wrong data: only one or multiple plugins from [List, Show, Create, Edit] can be added'
  });

  var chksrc = cl.indexOf('sources') > 3;

  output.push({
    level: 5,
    status: chksrc,
    err: 'synthax error: prefix "sources" not found or misplaced...'
  });

  var chksrcdata = cl.indexOf('sources') > -1 ? cl.slice(cl.indexOf('sources') + 1, cl.length) : [];

  output.push({
    level: 6,
    status: chksrcdata.length > 0 && chksrc && chkadd,
    err: 'missing data: at least one source should be declared.'
  });

  errorLog = output.filter(level => !level.status);

  response =
    errorLog.length > 0
      ? {
          valid: false,
          errLevel: errorLog[0].level,
          message: chalk.red(errorLog[0].err),
          operation: cl[0],
          module_name: cl[1],
          add: chkadddata,
          src: chksrcdata
        }
      : {
          valid: true,
          message: 'VALID COMMAND LINE STRUCTURE',
          operation: cl[0],
          module_name: cl[1],
          add: chkadddata,
          src: chksrcdata
        };

  return response;
}
