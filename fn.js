var chalk = require("chalk");

let aorCreate = sources => {
  items = sources.map(src => `<TextInput source="${src}" />`).join('\n\t');

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

let aorEdit = sources => {
  items = sources.map(src => `<TextInput source="${src}" />`).join('\n\t');

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

let aorList = sources => {
  items = sources.map(src => `<TextField source="${src}" />`).join('\n\t');
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

let aorShow = sources => {
  items = sources.map(src => `<TextField source="${src}" />`).join('\n\t');
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

let checkCmdLine = () => {
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
  };


  module.exports = {aorCreate, aorEdit, aorList, aorShow, checkCmdLine}
