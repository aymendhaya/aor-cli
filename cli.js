var fs = require('fs');
var path = require('path');
const chalk = require('chalk');
var moduleName = process.argv.slice(2)[0];
var subModules = process.argv.slice(3);

if (!fs.existsSync(moduleName)){
    fs.mkdirSync(moduleName);
    console.log(chalk.green.bold('|--' + moduleName ));
    fs.appendFile(moduleName + '/index.js', createIndex(subModules), function (err) {
        if (err) throw err;
        console.log(chalk.green('\t|-- index.js'));
      });
    subModules.map(filename => {
        fs.appendFile(moduleName + '/'+ filename + '.js', 'sds', function (err) {
            if (err) throw err;
            console.log(chalk.green('\t|-- ' + filename + '.js'));
          });
    })

}
else {console.log(moduleName + ': FOLDER EXIST...')}

function createIndex(subModules){
    let create = subModules.indexOf('Create') > -1 ? "import Create from './Create';\n" : '';
    let edit   = subModules.indexOf('Edit') > -1 ?  "import Edit from './Edit';\n" : '';
    let list   = subModules.indexOf('List') > -1 ?  "import List from './List';\n" : '';
    let show   = subModules.indexOf('Show') > -1 ?  "import Show from './Show';\n" : '';
    let Mports = ''.concat(create, edit, list, show)
    let Xports = "\nexport default { " + subModules.join(', ') + " };"
    let index = Mports.concat(Xports);
    return index
}












