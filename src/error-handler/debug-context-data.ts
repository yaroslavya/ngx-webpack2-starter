import { DebugContext } from "@angular/core/src/linker/debug_context";

/**
 * A shorter version of information from the DebugContext object.
 * For more details we always store the original debug context;
 */
export class DebugContextData {
    methods: any;
    componentRenderElement: any;
    componentHtml: any;
    renderNode: any;
    renderNodeHtml: any;
    original: DebugContext;

    /**
     * getting the angular2 context data out of the debug context object.
     *
     * @param context:DebugContext the debug context of the angular2. Provides all the needed information
     * about the error origin.
     */
    constructor(debugContext: DebugContext) {
        this.original = debugContext;

        if (debugContext) {
            let inner = debugContext.context;
            this.methods = {};

            for (let key in inner) {
                if (typeof inner[key] == "function") {
                    this.methods[key] = inner[key];
                    this.methods[key].body = inner[key].toString();
                } else {
                    this[key] = inner[key];
                }
            }

            this.componentRenderElement = debugContext.componentRenderElement;
            this.componentHtml = debugContext.componentRenderElement.outerHTML;

            this.renderNode = debugContext.renderNode;
            this.renderNodeHtml = debugContext.renderNode.outerHTML;
        }
    }
}
