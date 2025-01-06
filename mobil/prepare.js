const { ConfigParser } = require('cordova-common');
const fs = require('fs');
const plt = process.argv[2];
const env = process.argv[3];
const configFile = 'config.xml';
const packageFile = 'package.json';
const names = {
    android: {
        dev: 'Inclouded Lavinia DEV',
        stg: 'Inclouded Lavinia STG',
        prod: 'Inclouded Lavinia',
    },
    ios: {
        dev: 'Inclouded Lavinia',
        stg: 'Inclouded Lavinia',
        prod: 'Inclouded Lavinia',
    }
};
const ids = {
    android: {
        dev: 'hu.inclouded.lavinia.dev',
        stg: 'hu.inclouded.lavinia.stg',
        prod: 'hu.inclouded.lavinia',
    },
    ios: {
        dev: 'hu.inclouded.lavinia.dev',
        stg: 'hu.inclouded.lavinia.stg',
        prod: 'hu.inclouded.lavinia',
    }
};
function prepare() {
    if (plt && env) {
        const packageContentStr = fs.readFileSync(packageFile, 'utf-8');
        const packageContentJson = JSON.parse(packageContentStr);
        const name = names[plt][env];
        const shortName = name;
        const id = ids[plt][env];
        console.log('PLT:', plt);
        console.log('ENV:', env);
        console.log('NAME', name);
        console.log('SHORTNAME', shortName);
        console.log('BUNDLE_ID:', id);
        console.log('VERSION:', packageContentJson.version);
        fs.writeFileSync('bundle_id.txt', id);
        const config = new ConfigParser(configFile);
        config.setName(name);
        config.setPackageName(id);
        config.setVersion(packageContentJson.version);
        config.setShortName(shortName);
        config.write();
        console.log('Done!\n');
    }
}
prepare();