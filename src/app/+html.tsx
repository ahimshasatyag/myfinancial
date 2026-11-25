import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root HTML untuk Web Static/SSR Rendering di Expo Router.
 * Menyertakan {headNodes} dan {bodyNodes} dari useServerDocumentContext()
 * agar seluruh bundle script JavaScript dan stylesheet terinjeksi dengan sempurna.
 */
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();

  return (
    <html lang="id" className="dark" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* Node head yang diinjeksi oleh Expo Router (bundle css, font, meta) */}
        {headNodes}

        <ScrollViewStyleReset />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: #090909 !important;
                color: #F5F5F5;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              body {
                overflow: hidden;
                user-select: none;
                -webkit-user-select: none;
              }
              img {
                -webkit-user-drag: none;
              }
            `,
          }}
        />
      </head>
      <body {...bodyAttributes}>
        {children}
        {/* Wajib disertakan agar bundle script JavaScript terinjeksi ke client */}
        {bodyNodes}
      </body>
    </html>
  );
}
