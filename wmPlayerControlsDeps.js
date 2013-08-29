if(process.platform == 'win32'){
    fs = require('fs');
    var exec = require('child_process').exec;
    fs.exists('build\\Release\\mediaWMplayerControls.node', function(exists){
        if(exists){
            console.log('mediaWMplayerControls.node found! Copying to node_modules/');
            exec('copy build\\Release\\mediaWMplayerControls.node node_modules');            
        }
        else{
            console.log('mediaWMplayerControls.node not found! proceeding with fresh compilation');
            exec('node-gyp configure build',function (error, stdout, stderr) {
                console.log('---stdout---\n' + stdout + '\n');
                if (error !== null) 
                    console.log('\nexec error: ' + error);
            });
        }        
    });
}