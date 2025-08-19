(function() {
    const vscode = acquireVsCodeApi();
    
    // Store references to DOM elements
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');
    const resultsPanel = document.getElementById('resultsPanel');
    const resultsContent = document.getElementById('resultsContent');
    
    // Handle messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'optimizationResult':
                showResults(message.message);
                break;
        }
    });
    
    // Set up feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        const command = card.dataset.command;
        const button = card.querySelector('.run-button');
        
        card.addEventListener('click', (e) => {
            if (e.target !== button) {
                runCommand(command);
            }
        });
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            runCommand(command);
        });
    });
    
    function runCommand(command) {
        // Show optimizing status for optimize command
        if (command === 'neatify.optimizeFile') {
            statusBar.className = 'status-bar optimizing';
            statusText.textContent = 'Optimizing your code...';
        }
        
        vscode.postMessage({
            type: 'runCommand',
            command: command
        });
    }
    
    function showResults(message) {
        statusBar.className = 'status-bar success';
        statusText.textContent = 'Optimization complete!';
        
        resultsContent.textContent = message;
        resultsPanel.style.display = 'block';
        
        // Scroll to results
        resultsPanel.scrollIntoView({ behavior: 'smooth' });
    }
}());