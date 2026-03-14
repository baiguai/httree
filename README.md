# Httree                                                                                                                                                                                                          
Httree is a treeview-driven text editor written as a stand alone .html file.                                                                                                                                      
It is designed for use on any device that is capable of running a contemporary                                                                                                                                    
web browser.                                                                                                                                                                                                      
                                                                                                                                                                                                                  
If it is being used on a device that is capable of running a Node.js server                                                                                                                                       
it is capable of auto-saving.                                                                                                                                                                                     
                                                                                                                                                                                                                  
However on more restricted machines, it saves updates in the same manner your                                                                                                                                     
browser handles downloads. Be sure to consult httree_help.html for information                                                                                                                                    
on 'saving', because it is different from using a 'normal' editor.                                                                                                                                                
And in one way, even though it can be a bit more work - it also ends up                                                                                                                                           
storing a running history.                                                                                                                                                                                        
                                                                                                                                                                                                                  
Also refer to the help docs for information on setting up auto-save.                                                                                                                                              
                                                                                                                                                                                                                  
                                                                                                                                                                                                                  
## A Vim Lover's Editor                                                                                                                                                                                           
Httree utilizes Vim-like key bindings to do nearly everything.                                                                                                                                                    
However if you are on a device like a phone, there are some tools that allow                                                                                                                                      
you to perform actions via the screen, and Vim keys you wouldn't really                                                                                                                                           
be able to utilize due to the limited keys on most virtual keyboards aren't                                                                                                                                       
active.                                                                                                                                                                                                           
                                                                                                                                                                                                                  
                                                                                                                                                                                                                  
----                                                                                                                                                                                                              
                                                                                                                                                                                                                  
## Developer Notes                                                                                                                                                                                                
If you are a developer, and are working with the Httree.html code, you may                                                                                                                                        
notice that the code formatting isn't necessarily... great.                                                                                                                                                       
This is because when notes are saved, sometimes the formatting gets altered.                                                                                                                                      
After this happened a couple of times, I gave up on keeping it pretty and                                                                                                                                         
began just making sure the logic and code itself is pretty :)

# HTTree Installer

This document provides instructions on how to use the `installer.sh` and `installer.bat` scripts to create new instances of the HTTree application.

## Features

- Creates a new HTML file and a corresponding saver script for each instance.
- Automatically assigns a new port number for each instance.
- Updates the `htnodes.sh` or `htnodes.bat` script to include the new instance.
- Prevents the creation of duplicate instances.

## Usage

### installer.sh (for Linux and macOS)

To use the `installer.sh` script, run the following command from your terminal:

```bash
./installer.sh <filename_minus_extension> <target_directory>
```

- `<filename_minus_extension>`: The name of the new instance (e.g., `my_new_tree`).
- `<target_directory>`: The directory where the new instance will be created.

### installer.bat (for Windows)

To use the `installer.bat` script, run the following command from your command prompt:

```batch
installer.bat <filename_minus_extension> <target_directory>
```

- `<filename_minus_extension>`: The name of the new instance (e.g., `my_new_tree`).
- `<target_directory>`: The directory where the new instance will be created.

## How it works

The installer scripts perform the following actions:

1. Check if an instance with the same name already exists in the target directory. If it does, the script will abort.
2. Determine the next available port number by checking the `htnodes.sh` or `htnodes.bat` script.
3. Create a new HTML file and a saver script in the target directory.
4. Update the `htnodes.sh` or `htnodes.bat` script to include the new instance.
5. Install the required Node.js packages in the target directory.

After running the installer, you can start the new instance by running the `htnodes.sh` or `htnodes.bat` script.
