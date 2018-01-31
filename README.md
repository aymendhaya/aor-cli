# aor-cli
Command Line Interface for admin-on-rest Framework

## Install

```bash
$ npm install -g aor-cli
```

## Create Module

```
src/components/modules/ $ aor create FirstModule with List implement id, firstname, lastname
```

## Result:
```bash
src/components/modules/FirstComponent/List.js
src/components/modules/FirstComponent/index.js
```

## List.js

```jsx
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Responsive,
  SimpleList
} from 'admin-on-rest';
import { ShowButton } from 'admin-on-rest/lib/mui/button';
import Filter from './Filter';

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
## index.js

```js
import List from './List';

export default { List };
```

## App.js

```js
// This section should be added manually

import FirstModule from './components/FirstModule';

    <Resource
      name="BASEPATH"
      list={FirstModule.List}
    />
```