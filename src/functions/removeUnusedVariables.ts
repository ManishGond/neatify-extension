import * as vscode from "vscode";
import * as ts from "typescript";

export function removeUnusedVariables() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const fileText = editor.document.getText();
  const filePath = editor.document.fileName;

  const options: ts.CompilerOptions = { allowJs: true, checkJs: true };
  const host = ts.createCompilerHost(options);

  host.readFile = () => fileText;
  host.getSourceFile = (fileName) =>
    ts.createSourceFile(fileName, fileText, ts.ScriptTarget.Latest, true);

  const program = ts.createProgram([filePath], options, host);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    return;
  }

  const edit = new vscode.WorkspaceEdit();
  let removedCount = 0;

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const symbol = checker.getSymbolAtLocation(node.name);
      if (!symbol) {
        return;
      }

      // Count references excluding the declaration itself
      let usageCount = 0;
      ts.forEachChild(sourceFile, function countReferences(n) {
        if (
          ts.isIdentifier(n) &&
          n.text === node.name.getText() &&
          n !== node.name
        ) {
          usageCount++;
        }
        ts.forEachChild(n, countReferences);
      });

      if (usageCount === 0) {
        const parentList = node.parent;
        if (ts.isVariableDeclarationList(parentList)) {
          const statement = parentList.parent;
          if (ts.isVariableStatement(statement)) {
            if (parentList.declarations.length === 1) {
              // Remove entire statement
              const range = new vscode.Range(
                editor.document.positionAt(statement.getFullStart()),
                editor.document.positionAt(statement.getEnd())
              );
              edit.delete(editor.document.uri, range);
            } else {
              // Remove single declaration safely (simple case)
              const range = new vscode.Range(
                editor.document.positionAt(node.getFullStart()),
                editor.document.positionAt(node.getEnd())
              );
              edit.delete(editor.document.uri, range);
            }
            removedCount++;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  });

  vscode.workspace.applyEdit(edit).then(() => {
    if (removedCount === 0) {
      vscode.window.showInformationMessage("No unused variables found!");
    } else {
      vscode.window.showInformationMessage(
        `Removed ${removedCount} unused variable(s).`
      );
    }
  });
}
