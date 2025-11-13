#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HttreeDeployer {
    constructor() {
        this.sourceDir = __dirname;
        this.httreeHtml = path.join(this.sourceDir, 'httree.html');
        this.saverJs = path.join(this.sourceDir, 'saver.js');
        this.packageJson = path.join(this.sourceDir, 'package.json');
    }

    async deploy(targetPath, fileName, port) {
        try {
            // Validate inputs
            if (!targetPath || !fileName || !port) {
                throw new Error('Missing required parameters: targetPath, fileName, and port are required');
            }

            // Resolve and create target directory
            const resolvedTargetPath = path.resolve(targetPath);
            if (!fs.existsSync(resolvedTargetPath)) {
                fs.mkdirSync(resolvedTargetPath, { recursive: true });
                console.log(`Created directory: ${resolvedTargetPath}`);
            }

            // Copy package.json if it doesn't exist
            const targetPackageJson = path.join(resolvedTargetPath, 'package.json');
            if (!fs.existsSync(targetPackageJson)) {
                fs.copyFileSync(this.packageJson, targetPackageJson);
                console.log(`Copied package.json to: ${targetPackageJson}`);
            }

            // Always install dependencies to ensure they're up to date
            console.log('Installing dependencies...');
            process.chdir(resolvedTargetPath);
            execSync('npm install', { stdio: 'inherit' });
            console.log('Dependencies installed successfully');

            // Read and modify httree.html
            let httreeContent = fs.readFileSync(this.httreeHtml, 'utf8');
            
            // Update nodePort and fileName variables
            httreeContent = httreeContent.replace(
                /let nodePort = 0;/,
                `let nodePort = ${port};`
            );
            
            httreeContent = httreeContent.replace(
                /let fileName = "help";/,
                `let fileName = "${fileName}";`
            );
            
            // Write modified httree.html
            const targetHtmlPath = path.join(resolvedTargetPath, `${fileName}.html`);
            fs.writeFileSync(targetHtmlPath, httreeContent, 'utf8');
            console.log(`Created: ${targetHtmlPath}`);

            // Read and modify saver.js
            let saverContent = fs.readFileSync(this.saverJs, 'utf8');
            
            // Update FILE_PATH and PORT in saver.js
            saverContent = saverContent.replace(
                /const FILE_PATH = "\.\/httree\.html";/,
                `const FILE_PATH = "./${fileName}.html";`
            );
            
            saverContent = saverContent.replace(
                /const PORT = 3000;/,
                `const PORT = ${port};`
            );
            
            // Write modified saver.js with svr_ prefix
            const targetSaverPath = path.join(resolvedTargetPath, `svr_${fileName}.js`);
            fs.writeFileSync(targetSaverPath, saverContent, 'utf8');
            console.log(`Created: ${targetSaverPath}`);

            // Create backups directory
            const backupsDir = path.join(resolvedTargetPath, 'backups');
            if (!fs.existsSync(backupsDir)) {
                fs.mkdirSync(backupsDir, { recursive: true });
                console.log(`Created backups directory: ${backupsDir}`);
            }

            console.log('\n✅ Deployment successful!');
            console.log(`📁 Target directory: ${resolvedTargetPath}`);
            console.log(`📄 HTML file: ${fileName}.html`);
            console.log(`🔧 Saver script: svr_${fileName}.js`);
            console.log(`🌐 Port: ${port}`);
            console.log('\n🚀 To start the saver service:');
            console.log(`   cd "${resolvedTargetPath}"`);
            console.log(`   node svr_${fileName}.js`);
            console.log('\n📝 Then open the HTML file in your browser and use "n" key to save.');

        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }

    showHelp() {
        console.log(`
Httree Deployment Tool

USAGE:
  node deploy.js <target-path> <file-name> <port>

ARGUMENTS:
  target-path    Directory where the files will be deployed
  file-name      Name for the HTML file (without .html extension)
  port           Port number for the saver service

EXAMPLES:
  node deploy.js ./my-notes mynotes 3001
  node deploy.js /Users/john/Documents/notes work-notes 8080
  node deploy.js C:\\Notes\\project project-notes 3002

DESCRIPTION:
  This tool deploys the httree.html notes editor with a Node.js saver service.
  It will:
  - Copy and configure httree.html with the specified port
  - Copy and configure saver.js with the specified file name and port
  - Install required Node.js dependencies
  - Create necessary directories (backups, node_modules)
  - Set up a complete, ready-to-use notes environment

REQUIREMENTS:
  - Node.js installed on the system
  - Write permissions to the target directory
        `);
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    const deployer = new HttreeDeployer();
    deployer.showHelp();
    process.exit(0);
}

if (args.length !== 3) {
    console.error('❌ Error: Exactly 3 arguments required: target-path, file-name, and port');
    console.error('Use --help for usage information');
    process.exit(1);
}

const [targetPath, fileName, portStr] = args;

// Validate port number
const port = parseInt(portStr, 10);
if (isNaN(port) || port < 1 || port > 65535) {
    console.error('❌ Error: Port must be a valid number between 1 and 65535');
    process.exit(1);
}

// Validate file name
if (!/^[a-zA-Z0-9_-]+$/.test(fileName)) {
    console.error('❌ Error: File name must contain only letters, numbers, hyphens, and underscores');
    process.exit(1);
}

const deployer = new HttreeDeployer();
deployer.deploy(targetPath, fileName, port);