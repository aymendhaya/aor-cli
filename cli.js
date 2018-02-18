var fs = require("fs");
var rimraf = require("rimraf");
var path = require("path");
var chalk = require("chalk");

var cl = checkCmdLine();

if (cl.valid && cl.operation === "create") {
  if (!fs.existsSync(cl.fname)) {
    fs.mkdirSync(cl.fname);
    console.log(chalk.green.bold("|--" + cl.fname));
    fs.appendFile(cl.fname + "/index.js", aorIndex(cl.add), function(err) {
      if (err) throw err;
      console.log(chalk.green("\t|-- index.js"));
    });
    cl.add.map((filename, index) => {
      aor(filename)
        ? fs.appendFile(
            cl.fname + "/" + filename + ".js",
            aor(filename),
            function(err) {
              if (err) throw err;
              console.log(chalk.green("\t|-- " + filename + ".js"));
            }
          )
        : null;

      index === cl.add.length - 1
        ? setTimeout(function() {
            let listProp =
              cl.add.indexOf("List") > -1 ? `list="${cl.fname}.List"` : "";
            let editProp =
              cl.add.indexOf("Edit") > -1 ? `edit="${cl.fname}.Edit"` : "";
            let createProp =
              cl.add.indexOf("Create") > -1
                ? `create="${cl.fname}.Create"`
                : "";
            let showProp =
              cl.add.indexOf("Show") > -1 ? `show="${cl.fname}.Show"` : "";
            console.log(
              chalk.yellow.bold(`
              /// COPY THIS RESULT TO YOU MAIN MODULE ///\n\n\n\n\n
              import ${cl.fname} from 'path/to/${cl.fname}';\n
              <Resource name="${
                cl.fname
              }" ${listProp} ${editProp} ${createProp} ${showProp}/> `)
            );
          }, 1000)
        : null;
    });
  } else {
    console.log(chalk.red(cl.fname + " ALREADY EXIST..."));
  }
} else if (cl.valid && cl.operation === "update") {
  console.log(chalk.green.bold("|--" + cl.fname));
  fs.appendFile(cl.fname + "/index.js", aorIndex(cl.add), function(err) {
    if (err) throw err;
    console.log(chalk.green("\t|-- index.js"));
  });
  cl.add.map((filename, index) => {
    aor(filename)
      ? fs.appendFile(
          cl.fname + "/" + filename + ".js",
          aor(filename),
          function(err) {
            if (err) throw err;
            console.log(chalk.green("\t|-- " + filename + ".js"));
          }
        )
      : null;

    index === cl.add.length - 1
      ? setTimeout(function() {
          let listProp =
            cl.add.indexOf("List") > -1 ? `list="${cl.fname}.List"` : "";
          let editProp =
            cl.add.indexOf("Edit") > -1 ? `edit="${cl.fname}.Edit"` : "";
          let createProp =
            cl.add.indexOf("Create") > -1 ? `create="${cl.fname}.Create"` : "";
          let showProp =
            cl.add.indexOf("Show") > -1 ? `show="${cl.fname}.Show"` : "";
          console.log(
            chalk.yellow.bold(`
              /// COPY THIS RESULT TO YOU MAIN MODULE ///\n\n\n\n\n
              import ${cl.fname} from 'path/to/${cl.fname}';\n
              <Resource name="${
                cl.fname
              }" ${listProp} ${editProp} ${createProp} ${showProp}/> `)
          );
        }, 1000)
      : null;
  });
} else {
  console.log(cl.message);
}
// { valid: false,
//   errID: 1,
//   message: '\u001b[31msynthax error: "create" or "update" command not found...\u001b[39m',
//   operation: undefined,
//   fname: undefined,
//   add: [],
//   src: [] }

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
  items = cl.src.map(src => `<TextInput source="${src}" />`).join("\n\t");

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
  items = cl.src.map(src => `<TextField source="${src}" />`).join("\n\t");
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
  items = cl.src.map(src => `<TextInput source="${src}" />`).join("\n\t");

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
  items = cl.src.map(src => `<TextField source="${src}" />`).join("\n\t");
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

  var chkcr = cl[0] === "create";
  var chkup = cl[0] === "update";
  output.push({
    level: 1,
    status: chkcr || chkup,
    err: 'synthax error: "create" or "update" command not found...'
  });

  var chkmodulename =
    cl[1] !== undefined &&
    cl[1] !== "create" &&
    cl[1] !== "update" &&
    cl[1] !== "add";

  output.push({
    level: 2,
    status: chkmodulename,
    err: "synthax error: wrong or invalid module name..."
  });

  var chkadd = cl[2] === "add";

  output.push({
    level: 3,
    status: chkadd,
    err: 'synthax error: prefix "add" not found...'
  });

  var chkadddata =
    cl.indexOf("sources") > -1
      ? cl.slice(3, cl.indexOf("sources"))
      : cl.slice(3, cl.length);

  var validadds = true;
  for (var i = 0; i < chkadddata.length; i++) {
    if (!["Create", "Edit", "Show", "List"].includes(chkadddata[i])) {
      validadds = false;
      break;
    }
  }

  output.push({
    level: 4,
    status: chkadddata.length > 0 && chkadd && validadds,
    err:
      "missing or wrong data: only one or multiple plugins from [List, Show, Create, Edit] can be added"
  });

  var chksrc = cl.indexOf("sources") > 3;

  output.push({
    level: 5,
    status: chksrc,
    err: 'synthax error: prefix "sources" not found or misplaced...'
  });

  var chksrcdata =
    cl.indexOf("sources") > -1
      ? cl.slice(cl.indexOf("sources") + 1, cl.length)
      : [];

  output.push({
    level: 6,
    status: chksrcdata.length > 0 && chksrc && chkadd,
    err: "missing data: at least one source should be declared."
  });

  errorLog = output.filter(level => !level.status);

  response =
    errorLog.length > 0
      ? {
          valid: false,
          errID: errorLog[0].level,
          message: chalk.red(errorLog[0].err),
          operation: cl[0],
          fname: cl[1],
          add: chkadddata,
          src: chksrcdata
        }
      : {
          valid: true,
          message: "VALID COMMAND LINE STRUCTURE",
          operation: cl[0],
          fname: cl[1],
          add: chkadddata,
          src: chksrcdata
        };

  return response;
}
