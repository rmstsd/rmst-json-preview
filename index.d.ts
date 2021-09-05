import * as React from 'react';

export interface ReactJsonPreviewProps {
    value?: any,
    showArrayIndex?: boolean,
    indent?: number,
    singleQuote?: boolean,
    keyQuote?: boolean
}

declare const ReactJsonPreview: React.ComponentType<ReactJsonPreviewProps>;
export default ReactJsonPreview;
