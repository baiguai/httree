# Httree Deployment Tool

A cross-platform Node.js tool for deploying httree.html notes editor with a Node.js saver service.

## Features

- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Automatic dependency installation
- ✅ Configurable file names and ports
- ✅ Creates complete, ready-to-use notes environment
- ✅ Built-in backup system
- ✅ Safety checks and validation

## Prerequisites

- Node.js installed on your system
- Write permissions to the target directory

## Usage

```bash
node deploy.js <target-path> <file-name> <port>
```

### Arguments

- `target-path`: Directory where files will be deployed
- `file-name`: Name for the HTML file (without .html extension)
- `port`: Port number for the saver service (1-65535)

### Examples

```bash
# Deploy to local directory
node deploy.js ./my-notes mynotes 3001

# Deploy to absolute path
node deploy.js /Users/john/Documents/notes work-notes 8080

# Deploy on Windows
node deploy.js C:\\Notes\\project project-notes 3002
```

## What It Does

The deployment tool will:

1. **Create target directory** (if it doesn't exist)
2. **Copy and configure files**:
   - `httree.html` → `<file-name>.html` (with configured port)
   - `saver.js` → `svr_<file-name>.js` (with configured file name and port)
   - `package.json` (for dependencies)
3. **Install dependencies** automatically
4. **Create directories**:
   - `node_modules/` (for npm packages)
   - `backups/` (for automatic backups)
5. **Configure settings**:
   - Sets the `nodePort` variable in HTML file
   - Sets `FILE_PATH` and `PORT` in saver script

## After Deployment

Once deployment is complete:

1. **Start the saver service**:
   ```bash
   cd "<target-path>"
   node svr_<file-name>.js
   ```

2. **Open the notes editor**:
   - Open `<file-name>.html` in your web browser
   - Use the `n` key to save your notes

3. **Multiple instances**:
   - You can run multiple instances on different ports
   - Each instance has its own file and saver script

## File Structure After Deployment

```
<target-path>/
├── <file-name>.html          # Configured httree notes editor
├── svr_<file-name>.js        # Configured saver service
├── package.json              # Node.js dependencies
├── package-lock.json         # Dependency lock file
├── node_modules/             # Installed dependencies
└── backups/                 # Automatic backups directory
```

## Safety Features

- **Port validation**: Ensures port is within valid range (1-65535)
- **File name validation**: Only allows alphanumeric characters, hyphens, and underscores
- **Dependency management**: Automatically installs required packages
- **Error handling**: Clear error messages for common issues

## Help

For usage information:
```bash
node deploy.js --help
```

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error, try a different port number:
```bash
node deploy.js ./notes mynotes 3002
```

### Permission Denied
Ensure you have write permissions to the target directory.

### Node.js Not Found
Install Node.js from [nodejs.org](https://nodejs.org/)

## Dependencies

The tool automatically installs these Node.js packages:
- `express`: Web server framework
- `body-parser`: Request body parsing middleware
- `cors`: Cross-Origin Resource Sharing middleware