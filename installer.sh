#!/bin/bash

# Check for the correct number of arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <filename_minus_extension> <target_directory>"
    exit 1
fi

FILENAME=$1
TARGET_DIR=$2
HTNODES_SH="$HOME/htnodes.sh"

# Determine the next available port
PORT=3000
if [ -f "$HTNODES_SH" ]; then
    # Find the last port number from the comments at the top of the script
    LAST_PORT=$(grep -E '^# [0-9]+$' "$HTNODES_SH" | tail -n 1 | sed 's/# //')
    if [ -n "$LAST_PORT" ]; then
        PORT=$((LAST_PORT + 1))
    else
        # If no port comments are found, check for the old format
        LAST_PORT=$(grep -o 'echo ".*: [0-9]*"' "$HTNODES_SH" | tail -n 1 | grep -o '[0-9]*$')
        if [ -n "$LAST_PORT" ]; then
            PORT=$((LAST_PORT + 1))
        fi
    fi
fi

# Create the htnodes.sh script if it doesn't exist
if [ ! -f "$HTNODES_SH" ]; then
    echo "#! /bin/bash" > "$HTNODES_SH"
    echo "" >> "$HTNODES_SH"
    echo "# 3000" >> "$HTNODES_SH"
    echo "" >> "$HTNODES_SH"
    echo "cd '$TARGET_DIR' && node 'svr_$FILENAME.js' &" >> "$HTNODES_SH"
    echo "" >> "$HTNODES_SH"
    echo "sleep 3" >> "$HTNODES_SH"
    echo "" >> "$HTNODES_SH"
    echo "echo \"\"" >> "$HTNODES_SH"
    echo "echo \"\"" >> "$HTNODES_SH"
    echo "echo \"\"" >> "$HTNODES_SH"
    echo "echo \"$FILENAME: $PORT\"" >> "$HTNODES_SH"
    echo "echo \"\"" >> "$HTNODES_SH"
    echo "echo \"\"" >> "$HTNODES_SH"
    echo "echo \"\"" >> "$HTNODES_SH"
    echo "" >> "$HTNODES_SH"
    echo "wait" >> "$HTNODES_SH"
    chmod +x "$HTNODES_SH"
else
    # Add the new port comment
    # Find the last port comment and insert after it
    LAST_PORT_LINE=$(grep -nE '^# [0-9]+$' "$HTNODES_SH" | tail -n 1 | cut -d: -f1)
    if [ -n "$LAST_PORT_LINE" ]; then
        sed -i "$((LAST_PORT_LINE))a# $PORT" "$HTNODES_SH"
    else
        # If no port comments, add one after the shebang
        sed -i '/^#! \/bin\/bash/a # '$PORT'' "$HTNODES_SH"
    fi

    # Add the new node service command before sleep 3
    sed -i "/^sleep 3/i cd '$TARGET_DIR' && node 'svr_$FILENAME.js' &" "$HTNODES_SH"

    # Add the new echo statement
    # Find the last echo with a port and insert after it.
    LAST_ECHO_LINE=$(grep -nE 'echo ".*: [0-9]+"' "$HTNODES_SH" | tail -n 1 | cut -d: -f1)
    if [ -n "$LAST_ECHO_LINE" ]; then
        sed -i "$((LAST_ECHO_LINE))a echo \"$FILENAME: $PORT\"" "$HTNODES_SH"
    else
        # If no port echos, add one before wait
        sed -i "/^wait/i echo \"$FILENAME: $PORT\"" "$HTNODES_SH"
    fi
fi

# Copy httree.html to the target directory
cp httree.html "$TARGET_DIR/$FILENAME.html"

# Update the node port in the new html file
sed -i "s/let nodePort = 0;/let nodePort = $PORT;/" "$TARGET_DIR/$FILENAME.html"

# Copy saver.js to the target directory
cp saver.js "$TARGET_DIR/svr_$FILENAME.js"

# Update the file name and port in the new saver.js file
sed -i "s|const FILE_PATH = \"./httree.html\";|const FILE_PATH = \"./$FILENAME.html\";|" "$TARGET_DIR/svr_$FILENAME.js"
sed -i "s/const PORT = 3000;/const PORT = $PORT;/" "$TARGET_DIR/svr_$FILENAME.js"

echo "New httree instance '$FILENAME' created in '$TARGET_DIR' on port $PORT."
echo "To start the node service, run: $HTNODES_SH"
