var fs = require("fs");
var rimraf = require("rimraf");
var path = require("path");
var chalk = require("chalk");
var moduleName = process.argv.slice(2)[0];
var subModules = process.argv.slice(3, process.argv.indexOf("implement"));
var sources = process.argv
  .slice(process.argv.indexOf("implement") + 1, process.argv.length)[0]
  .split(",");

if (!fs.existsSync(moduleName)) {
  fs.mkdirSync(moduleName);
  console.log(chalk.green.bold("|--" + moduleName));
  fs.appendFile(moduleName + "/index.js", aorIndex(subModules), function(err) {
    if (err) throw err;
    console.log(chalk.green("\t|-- index.js"));
  });
  subModules.map((filename, index) => {
    aor(filename)
      ? fs.appendFile(
          moduleName + "/" + filename + ".js",
          aor(filename),
          function(err) {
            if (err) throw err;
            console.log(chalk.green("\t|-- " + filename + ".js"));
          }
        )
      : null;

    index === subModules.length - 1
      ? setTimeout(function() {
          let listProp =
            subModules.indexOf("List") > -1 ? `list="${moduleName}.List"` : "";
          let editProp =
            subModules.indexOf("Edit") > -1 ? `edit="${moduleName}.Edit"` : "";
          let createProp =
            subModules.indexOf("Create") > -1
              ? `create="${moduleName}.Create"`
              : "";
          let showProp =
            subModules.indexOf("Show") > -1 ? `show="${moduleName}.Show"` : "";
          console.log(
            chalk.yellow.bold(`
            /// COPY THIS RESULT TO YOU MAIN MODULE ///\n\n\n\n\n
            import ${moduleName} from 'path/to/${moduleName}';\n
            <Resource name="${moduleName}" ${listProp} ${editProp} ${createProp} ${showProp}/> `)
          );
        }, 1000)
      : null;
  });
} else {
  console.log(chalk.red.bold(moduleName + " ALREADY EXIST..."));
}

function aorIndex(subModules) {
  let create =
    subModules.indexOf("Create") > -1 ? "import Create from './Create';\n" : "";
  let edit =
    subModules.indexOf("Edit") > -1 ? "import Edit from './Edit';\n" : "";
  let list =
    subModules.indexOf("List") > -1 ? "import List from './List';\n" : "";
  let show =
    subModules.indexOf("Show") > -1 ? "import Show from './Show';\n" : "";
  let Mports = "".concat(create, edit, list, show);
  let Xports = "\nexport default { " + subModules.join(", ") + " };";
  let index = Mports.concat(Xports);
  return index;
}

function aor(moduleName) {
  let output = null;
  if (moduleName === "Create") {
    output = aorCreate();
  }
  if (moduleName === "List") {
    output = aorList();
  }
  if (moduleName === "Show") {
    output = aorShow();
  }
  if (moduleName === "Edit") {
    output = aorEdit();
  }
  return output;
}

function aorCreate() {
  items = sources.map(src => `<TextInput source="${src}" />`).join("\n\t");

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
  items = sources.map(src => `<TextField source="${src}" />`).join("\n\t");
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
  items = sources.map(src => `<TextInput source="${src}" />`).join("\n\t");

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
  items = sources.map(src => `<TextField source="${src}" />`).join("\n\t");
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
