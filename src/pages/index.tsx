import Head from "next/head";

import styled from "@emotion/styled";
import { withApollo } from "config/apollo";
import { Hello } from "components/hello";

const Header = styled.h1`
  font-size: 30px;
  background: pink;
`;

function Home() {
  const Header2 = styled.h1`
    font-size: 70px;
    background: blue;
  `;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header>
          Welcome to <a href="https://nextjs.org">Next.js!!!++</a>
        </Header>

        <Choose>
          <When condition={true}>true</When>
          <Otherwise>false</Otherwise>
        </Choose>

        <Header2>Yess!</Header2>

        <Hello />
      </main>
    </div>
  );
}

export default withApollo({ ssr: true })(Home);
