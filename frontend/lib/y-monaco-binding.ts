import * as Y from 'yjs';

/**
 * Custom lightweight Yjs Monaco Editor binding helper.
 * Eliminates external dependency issues with y-monaco ES module imports in Webpack / Next.js.
 */
export class CustomYMonacoBinding {
  private ytext: Y.Text;
  private monacoEditor: any;
  private awareness: any;
  private isApplyingRemote: boolean = false;
  private isApplyingLocal: boolean = false;
  private textObserver: (event: Y.YTextEvent) => void;
  private monacoListener: any;

  constructor(ytext: Y.Text, monacoEditor: any, awareness?: any) {
    this.ytext = ytext;
    this.monacoEditor = monacoEditor;
    this.awareness = awareness;

    const model = monacoEditor.getModel ? monacoEditor.getModel() : null;

    // 1. Initial content sync: set Yjs content if empty, or sync Monaco model
    if (model) {
      const initialYText = ytext.toString();
      if (!initialYText && model.getValue()) {
        ytext.insert(0, model.getValue());
      } else if (initialYText && model.getValue() !== initialYText) {
        model.setValue(initialYText);
      }
    }

    // 2. Observe Yjs remote changes and reflect in Monaco editor
    this.textObserver = (event: Y.YTextEvent) => {
      if (this.isApplyingLocal) return;
      this.isApplyingRemote = true;
      try {
        const currentModel = this.monacoEditor.getModel();
        if (currentModel) {
          const newContent = this.ytext.toString();
          if (currentModel.getValue() !== newContent) {
            const position = this.monacoEditor.getPosition();
            currentModel.setValue(newContent);
            if (position) {
              this.monacoEditor.setPosition(position);
            }
          }
        }
      } finally {
        this.isApplyingRemote = false;
      }
    };

    ytext.observe(this.textObserver);

    // 3. Observe local Monaco edits and reflect in Yjs text
    if (model) {
      this.monacoListener = model.onDidChangeContent(() => {
        if (this.isApplyingRemote) return;
        this.isApplyingLocal = true;
        try {
          const newText = model.getValue();
          const currentYText = this.ytext.toString();
          if (newText !== currentYText) {
            this.ytext.doc?.transact(() => {
              this.ytext.delete(0, this.ytext.length);
              this.ytext.insert(0, newText);
            });
          }
        } finally {
          this.isApplyingLocal = false;
        }
      });
    }
  }

  public destroy() {
    if (this.ytext && this.textObserver) {
      this.ytext.unobserve(this.textObserver);
    }
    if (this.monacoListener && typeof this.monacoListener.dispose === 'function') {
      this.monacoListener.dispose();
    }
  }
}
