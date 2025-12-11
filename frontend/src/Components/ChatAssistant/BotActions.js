/**
 * Bot Actions Module
 * Handles execution of bot-triggered actions within the app
 */

class BotActionsRegistry {
    constructor() {
        this.actions = {};
        this.registerDefaultActions();
    }

    /**
     * Register a new action handler
     * @param {string} name - Action name
     * @param {function} handler - Action handler function
     */
    registerAction(name, handler) {
        this.actions[name] = handler;
    }

    /**
     * Execute an action
     * @param {object} action - Action object with type and parameters
     */
    async executeAction(action) {
        const handler = this.actions[action.type];
        if (!handler) {
            console.warn(`Unknown action type: ${action.type}`);
            return false;
        }

        try {
            await handler(action);
            return true;
        } catch (err) {
            console.error(`Error executing action ${action.type}:`, err);
            return false;
        }
    }

    /**
     * Execute multiple actions
     * @param {array} actions - Array of action objects
     */
    async executeActions(actions) {
        if (!Array.isArray(actions) || actions.length === 0) {
            return;
        }

        const results = [];
        for (const action of actions) {
            const success = await this.executeAction(action);
            results.push({ action, success });
        }

        return results;
    }

    /**
     * Register default actions
     */
    registerDefaultActions() {
        // Text highlighting action
        this.registerAction('highlight', highlightTextAction);
    }
}

/**
 * Highlight text action handler
 * Searches for text in the Quill editor and highlights it
 */
const highlightTextAction = async (action) => {
    const { text, color = '#ffeb3b' } = action;

    // Get the Quill instance from global scope
    const quill = window.quillInstance;
    if (!quill) {
        console.warn('Quill editor not available for highlighting');
        return;
    }

    // Get the editor content
    const content = quill.getText();
    const index = content.indexOf(text);

    if (index === -1) {
        console.warn(`Text not found for highlighting: "${text}"`);
        return;
    }

    // Apply highlighting
    quill.formatText(index, text.length, {
        background: color
    });

    // Scroll to the highlighted text
    const bounds = quill.getBounds(index);
    if (bounds) {
        const editorElement = quill.root.parentElement;
        editorElement.scrollTop = bounds.top - 100;
    }

    console.log(`Highlighted text: "${text}" at index ${index}`);
};

// Create and export a singleton instance
const botActions = new BotActionsRegistry();

export default botActions;
export { BotActionsRegistry };
