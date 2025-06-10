# ReSharper CLI Extension

A Visual Studio Code extension that integrates JetBrains ReSharper Command Line Tools to format and clean up C# code.

## Features

This extension provides three formatting commands that leverage JetBrains `cleanupcode` tool with the "Built-in: Reformat Code" profile:

### 1. Format Whole Solution
**Command:** `resharper-cli.formatWholeSolution`

Formats all files in the entire solution by:.

### 2. Format Current File
**Command:** `resharper-cli.formatCurrentFile`

Formats only the currently active file in the editor.

### 3. Format Changed Files
**Command:** `resharper-cli.formatChangedFiles`

Formats only files that have been modified in version.

## Requirements

- JetBrains ReSharper Command Line Tools must be installed
- The `jb` command must be available in your system PATH
- Git must be installed and available for the "Format Changed Files" command
- Workspace must contain a `.sln` file for the "Format Whole Solution" command

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type one of the following commands:
   - `Format Whole Solution` - Formats entire solution
   - `Format Current File` - Formats active file
   - `Format Changed Files` - Formats VCS changed files

## Commands

This extension contributes the following commands:

- `resharper-cli.formatWholeSolution`: Formats the entire solution using the ReSharper `cleanupcode` tool.
- `resharper-cli.formatCurrentFile`: Formats the currently active file in the editor.
- `resharper-cli.formatChangedFiles`: Formats files that have been changed according to version control.

## Keybindings

You can bind the extension commands to keyboard shortcuts by adding the following to your `keybindings.json`:

```json
{
    "key": "ctrl+alt+f",
    "command": "resharper-cli.formatWholeSolution",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+alt+c",
    "command": "resharper-cli.formatCurrentFile",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+alt+g",
    "command": "resharper-cli.formatChangedFiles",
    "when": "editorTextFocus"
}
}
```

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This extension uses JetBrains ReSharper Command Line Tools. Please refer to their [official documentation](https://www.jetbrains.com/help/resharper/ReSharper_Command_Line_Tools.html) for more information.
- Inspired by the need for a seamless integration of ReSharper formatting tools within Visual Studio Code.