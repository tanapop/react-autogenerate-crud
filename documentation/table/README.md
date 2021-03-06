## TABLE ##

This configuration must be done, if you want to add additional buttons that are above the table, or replace the existing button. In addition, this configuration can add buttons found on each row, and replace existing ones. To use this please follow the method below

<table>
  <thead>
    <tr>
      <td>No</td>
      <td>Props Name</td>
      <td>Type</td>
      <td>Default</td>
      <td>Required</td>
      <td>Description</td>
    </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>buttonTopTable</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>This will replace or add a button above the table. This existing object has attributes ['create', 'delete', 'exportCsv', 'exportExcel', 'import'] you can replace it just use the specify the attribute name, to know the list props and how to use it click <a href="#buttonTopTable">here</a></td>
  </tr>
  <tr>
    <td>2</td>
    <td>row</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>This will replace or add a button that is in each row, to use it click here, to use it click <a href="#row">here</a></td>
  </tr>
</tbody>
</table>

## buttonTopTable ##

<b>Current Props For Each Attribute Of buttonTopTable</b> 
<table>
  <thead>
    <tr>
      <td>No</td>
      <td>Props Name</td>
      <td>Type</td>
      <td>Default</td>
      <td>Required</td>
      <td>Description</td>
    </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>label</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Label for the button</td>
  </tr>
  <tr>
    <td>2</td>
    <td>class</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>Class for the button</td>
  </tr>
  <tr>
    <td>3</td>
    <td>onClick</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>The action when button clicked</td>
  </tr>
  <tr>
    <td>4</td>
    <td>size</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Size for the button, choose one of ['small', 'medium', 'large']</td>
  </tr>
  <tr>
    <td>5</td>
    <td>variant</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Variant for the button, choose one of ['text', 'flat', 'outlined', 'contained', 'raised', 'fab', 'extendedFab']</td>
  </tr>
  <tr>
    <td>6</td>
    <td>style</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>Styling your button</td>
  </tr>
  <tr>
    <td>7</td>
    <td>href</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>If your button doesnt have an action, you can fill the href to navigate to another page</td>
  </tr>
  <tr>
    <td>8</td>
    <td>type</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Just fill button</td>
  </tr>
  <tr>
    <td>9</td>
    <td>iconName</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>See the full icon at <a href="https://material.io/tools/icons/">here</a></td>
  </tr>
</tbody>
</table>
<b>Because this project using material ui, you can use their props from official website at <a href="https://material-ui.com/api/button/">here</a></b>
<br></br>

<b id="buttonTopTable">This is how to using it</b>
```javascript
<CRUDGenerate
{...anotherProps}
table={{
   buttonTopTable: {
    'create': {
        label: "New Create", // modifiy existing button
      },
    'delete': {
        label: 'New Delete' // modifiy existing button
    },
    'newButton': { // add new button
        label: 'New Button',
        onClick: () => alert(1)
    },
   }
}}
/>
```

## row ##

<b>Current Props For Each Attribute Of row</b> 
<table>
  <thead>
    <tr>
      <td>No</td>
      <td>Props Name</td>
      <td>Type</td>
      <td>Default</td>
      <td>Required</td>
      <td>Description</td>
    </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>replaceUrl</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>If your new button, there is a link where in the link someone wants to be replaced, then enter the name you want to replace here</td>
  </tr>
  <tr>
    <td>2</td>
    <td>attributeName</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>This is useful for replacing replaceUrl as a value derived from the data server</td>
  </tr>
  <tr>
    <td>3</td>
    <td>additionalButtons</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>This configuration same like buttonTopTable, the existing attribute name butotn each row there are ['update', 'delete']</td>
  </tr>
</tbody>
</table>


<b id="row">This is how to using it</b>
```javascript
<CRUDGenerate
{...anotherProps}
table={{
   buttonTopTable: {
    'create': {
        label: "New Create", // modifiy existing button
      },
    'delete': {
        label: 'New Delete' // modifiy existing button
    },
    'newButton': { // add new button
        label: 'New Button',
        onClick: () => alert(1)
    },
   },
   row: {
    replaceUrl: '{id}',
    attributeName: 'id',
    additionalButtons: {
      'update': {
        label: 'New Update'
      },
      'delete': {
        label: 'New Delete'
      },
      'newButton': {
        label: 'test',
        href: 'http://localhost:4000/user/id={id}'
      }
    }
   }
}}
/>
```

## YOU CAN SEE FULL EXAMPLE CONFIGURATION AT <a href="https://github.com/azharprabudi/react-autogenerate-crud/blob/master/src/config-full-form-user.js">HERE</a> ##


<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a></b>
