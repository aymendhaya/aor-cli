var fs = require('fs');
var path = require('path');
var moduleName = process.argv.slice(2)[0];
var subModules = process.argv.slice(3);

if (!fs.existsSync(moduleName)){
    fs.mkdirSync(moduleName);
    console.log(moduleName + ' module created successfully...')
    fs.appendFile(moduleName + '/'+ filename + '.js', index, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    subModules.map(filename => {
        fs.appendFile(moduleName + '/'+ filename + '.js', 'sds', function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    })

}
else {console.log(moduleName + ': FOLDER EXIST...')}

var index = `import Create from './Create';
import Show from './Show';
import List from './List';
import Edit from './Edit';

export default { Create, Show, List, Edit };`











