import { exec } from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const formatWholeSolutionCommand = vscode.commands.registerCommand('resharper-cli.formatWholeSolution', async () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

		if (!workspaceFolder) {
			vscode.window.showErrorMessage('No workspace folder found');
			return;
		}

		const workspacePath = workspaceFolder.uri.fsPath;

		// Look for .sln and .slnx files in workspace
		const slnFiles = await vscode.workspace.findFiles('**/*.{sln,slnx}', '**/node_modules/**', 1);

		if (slnFiles.length === 0) {
			vscode.window.showErrorMessage('No .sln or .slnx file found in workspace');
			return;
		}

		const slnPath = slnFiles[0].fsPath;
		const command = `jb cleanupcode --profile="Built-in: Reformat Code" "${slnPath}"`;

		vscode.window.showInformationMessage('Running JetBrains cleanup on whole solution ...');

		exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
                return;
            }
            
            if (stderr) {
                vscode.window.showWarningMessage(`Warning: ${stderr}`);
            }
            
            vscode.window.showInformationMessage('Code cleanup completed successfully!');
            
            if (stdout) {
                const outputChannel = vscode.window.createOutputChannel('JetBrains Cleanup');
                outputChannel.appendLine(stdout);
                outputChannel.show();
            }
        });
	});

	const formatCurrentFileCommand = vscode.commands.registerCommand('resharper-cli.formatCurrentFile', async () => {
		const activeEditor = vscode.window.activeTextEditor;

		if (!activeEditor) {
			vscode.window.showErrorMessage('No active file found');
			return;
		}

		const filePath = activeEditor.document.uri.fsPath;
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);

		if (!workspaceFolder) {
			vscode.window.showErrorMessage('File is not in a workspace folder');
			return;
		}

		const workspacePath = workspaceFolder.uri.fsPath;
		const command = `jb cleanupcode --profile="Built-in: Reformat Code" "${filePath}"`;

		vscode.window.showInformationMessage('Running JetBrains cleanup on current file ...');

		exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Error: ${error.message}`);
				return;
			}
			
			if (stderr) {
				vscode.window.showWarningMessage(`Warning: ${stderr}`);
			}
			
			vscode.window.showInformationMessage('Code cleanup completed successfully!');
			
			if (stdout) {
				const outputChannel = vscode.window.createOutputChannel('JetBrains Cleanup');
				outputChannel.appendLine(stdout);
				outputChannel.show();
			}
		});
	});

	const formatChangedFilesCommand = vscode.commands.registerCommand('resharper-cli.formatChangedFiles', async () => {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

		if (!workspaceFolder) {
			vscode.window.showErrorMessage('No workspace folder found');
			return;
		}

		const workspacePath = workspaceFolder.uri.fsPath;

		// Combine git commands to get all changed files
		const gitCommands = [
			'git --no-pager diff --name-only',
			'git --no-pager diff --cached --name-only', 
			'git --no-pager ls-files --others --exclude-standard'
		];

		const combinedCommand = gitCommands.join(' && ');
		
		exec(combinedCommand, { cwd: workspacePath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Git error: ${error.message}`);
				return;
			}

			if (stderr) {
				vscode.window.showWarningMessage(`Git warning: ${stderr}`);
			}

			// Parse output and combine all changed files
			const allFiles = stdout.trim().split('\n').filter(file => file.endsWith('.cs'));

			// Remove duplicates and filter for C# files
			const uniqueFiles = [...new Set(allFiles)];

			if (uniqueFiles.length === 0) {
				vscode.window.showInformationMessage('No changed C# files found');
				return;
			}

			vscode.window.showInformationMessage(`Running JetBrains cleanup on ${uniqueFiles.length} changed files ...`);

			// Format each changed file
			let completedFiles = 0;
			uniqueFiles.forEach(file => {
				const filePath = `${workspacePath}/${file}`;
				const command = `jb cleanupcode --profile="Built-in: Reformat Code" "${filePath}"`;

				exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
					completedFiles++;

					if (error) {
						vscode.window.showErrorMessage(`Error formatting ${file}: ${error.message}`);
					}

					if (completedFiles === uniqueFiles.length) {
						vscode.window.showInformationMessage('Code cleanup completed for all changed files!');
					}
				});
			});
		});
	});

	context.subscriptions.push(formatWholeSolutionCommand, formatCurrentFileCommand, formatChangedFilesCommand);
}

export function deactivate() { }