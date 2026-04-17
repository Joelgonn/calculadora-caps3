// types/pdfjs-dist.d.ts
declare module 'pdfjs-dist/build/pdf.js' {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export interface TextContent {
    items: Array<{
      str: string;
      transform: number[];
      width: number;
      height: number;
    }>;
  }

  export interface GlobalWorkerOptionsType {
    workerSrc: string | undefined;
  }

  export const GlobalWorkerOptions: GlobalWorkerOptionsType;
  
  export function getDocument(params: { data: Uint8Array }): {
    promise: Promise<PDFDocumentProxy>;
  };
}