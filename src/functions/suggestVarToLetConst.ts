import * as vscode from "vscode";
import * as ts from "typescript";

export function suggestVarToLetConst() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const fileText = editor.document.getText();
  const sourceFile = ts.createSourceFile(
    editor.document.fileName,
    fileText,
    ts.ScriptTarget.Latest,
    true
  );

  const edit = new vscode.WorkspaceEdit();
  let changedCount = 0;

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isVariableStatement(node)) {
      const keyword = node.getFirstToken();
      if (!keyword) {
        return;
      }
      if (keyword.kind === ts.SyntaxKind.VarKeyword) {
        // Replace 'var' with 'let'
        const range = new vscode.Range(
          editor.document.positionAt(keyword.getStart()),
          editor.document.positionAt(keyword.getEnd())
        );
        edit.replace(editor.document.uri, range, "let");
        changedCount++;
      }
    }
  });

  vscode.workspace.applyEdit(edit).then(() => {
    if (changedCount === 0) {
      vscode.window.showInformationMessage("No 'var' declarations found.");
    } else {
      vscode.window.showInformationMessage(
        `Converted ${changedCount} 'var' to 'let'.`
      );
    }
  });
}
