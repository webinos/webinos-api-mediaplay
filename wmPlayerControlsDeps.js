if(process.platform == 'win32'){
    fs = require('fs');
    var exec = require('child_process').exec;
    fs.exists('node_modules\\mediaWMplayerControls.node', function(exists){
        if(exists)
            console.log('mediaWMplayerControls.node found!');            
        else{
            console.log('mediaWMplayerControls.node not found! proceeding with fresh compilation');
            console.log('Required dependencies:');
            console.log('\tC:/WinDDK/7600.16385.1/inc/atl71');
            console.log('\tC:/WinDDK/7600.16385.1/lib/ATL/i386/atls.lib');
            console.log('\tC:/WinDDK/7600.16385.1/lib/ATL/i386/atlsd.lib');
            console.log('\tC:\Program Files (x86)\Microsoft SDKs\Windows\v7.0A\Include');
            exec('node-gyp configure build',function (error, stdout, stderr) {
                console.log('---stdout---\n' + stdout + '\n');
                if (error !== null) 
                    console.log('\nexec error: ' + error);
            });
        }        
    });
}