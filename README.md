# aor-cli
Command Line Interface for admin-on-rest Framework

## Install

```bash
$ npm install -g aor-cli
```

# Create Single Module

```
$aor create FirstModule with List implement id, firstname, lastname
```

 Result:
```bash
./FirstModule/List.js
./FirstModule/index.js
```

 FirstModule/List.js

```jsx
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Responsive,
  SimpleList
} from 'admin-on-rest';

export default props => (
  <List {...props} >
    <Responsive
      small={
        <SimpleList
          primaryText={record => record.id}
          secondaryText={record => record.firstname}
          tertiaryText={record => record.lastname}
        />
      }
      medium={
        <Datagrid>
          <TextField source="id" />
          <TextField source="firstname" />
          <TextField source="lastname" />
        </Datagrid>
      }
    />
  </List>
);
```
 FirstModule/index.js

```js
import List from './List';

export default { List };
```

 App.js (Or index.js)

```js
// This section should be added manually

import FirstModule from './components/FirstModule';

    <Resource
      name="BASEPATH"
      list={FirstModule.List}
    />
```

# Create Multiple Modules

```
 $aor create SecondModule with List, Create, Edit implement id, firstname, lastname
```

 Result:
```bash
./SecondModule/List.js
./SecondModule/Create.js
./SecondModule/Edit.js
./SecondModule/index.js
```

 SecondModule/List.js

```jsx
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Responsive,
  SimpleList
} from 'admin-on-rest';

export default props => (
  <List {...props} >
    <Responsive
      small={
        <SimpleList
          primaryText={record => record.id}
          secondaryText={record => record.firstname}
          tertiaryText={record => record.lastname}
        />
      }
      medium={
        <Datagrid>
          <TextField source="id" />
          <TextField source="firstname" />
          <TextField source="lastname" />
        </Datagrid>
      }
    />
  </List>
);
```

SecondModule/Create.js

```jsx
import React from 'react';
import {
  Create,
  TextInput,
  SimpleForm
} from 'admin-on-rest';

export default props => (
  <Create {...props} >
    <SimpleForm>
        <TextInput source="id" />
        <TextInput source="firstname" />
        <TextInput source="lastname" />
    </SimpleForm>
  </Create>
);
```

SecondModule/Edit.js

```jsx
import React from 'react';
import {
  Edit,
  TextInput,
  SimpleForm
} from 'admin-on-rest';

export default props => (
  <Edit {...props} >
    <SimpleForm>
        <TextInput source="id" />
        <TextInput source="firstname" />
        <TextInput source="lastname" />
    </SimpleForm>
  </Edit>
);
```
 SecondModule/index.js

```js
import List from './List';
import Create from './Create';
import Edit from './Edit';

export default { List, Create, Edit };
```

 App.js (Or index.js)

```js
// This section should be added manually

import SecondModule from './components/SecondModule';

    <Resource
      name="BASEPATH"
      list={SecondModule.List}
      create={SecondModule.Create}
      edit={SecondModule.Edit}
    />
```