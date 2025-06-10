# Change Log

All notable changes to the "resharper-cli" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - Initial Release

### Added
- **Format Whole Solution** command (`resharper-cli.formatWholeSolution`)
  - Formats entire solution using JetBrains cleanupcode tool
- **Format Current File** command (`resharper-cli.formatCurrentFile`)
  - Formats only the currently active file in the editor
- **Format Changed Files** command (`resharper-cli.formatChangedFiles`)
  - Detects changed files using git commands (unstaged, staged, and untracked)
  - Formats only modified files for efficient cleanup

### Features
- Integration with JetBrains ReSharper Command Line Tools
- Uses "Built-in: Reformat Code" profile for consistent formatting