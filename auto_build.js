const { spawn } = require('child_process');

console.log("Starting auto-build script...");

const isWindows = process.platform === 'win32';
const cmd = isWindows ? 'eas.cmd' : 'eas';
const args = ['build', '-p', 'android', '--profile', 'preview', '--no-wait'];

const child = spawn(cmd, args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
    cwd: process.cwd()
});

child.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output); // Mirror output to console

    if (output.includes('Generate a new Android Keystore?')) {
        console.log('\n--> Detected Keystore Prompt. Sending "Y"...');
        child.stdin.write('Y\n');
    }
});

child.stderr.on('data', (data) => {
    const output = data.toString();
    process.stderr.write(output);
});

child.on('close', (code) => {
    console.log(`\nProcess exited with code ${code}`);
    process.exit(code);
});
