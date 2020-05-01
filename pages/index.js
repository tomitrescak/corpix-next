import Head from "next/head";

import { css } from "emotion";

export default function Home() {
  const big = css`
    font-size: 20px;
    background: pink;
  `;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={big}>
          Welcome to <a href="https://nextjs.org">Next.js!!!++</a>
        </h1>
      </main>
    </div>
  );
}
