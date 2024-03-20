import Predictions from "components/predictions";
import Head from "next/head";
import pkg from "../../package.json";
import { getRecentPredictions } from "lib/db";

export default function RecentScribbles({ predictions }) {
  return (
    <div>
      <Head>
        <meta name="description" content={pkg.appMetaDescription} />
        <meta property="og:title" content={pkg.appName} />
        <meta property="og:description" content={pkg.appMetaDescription} />
        <title>{pkg.appName}</title>s
      </Head>
      <main className="container max-w-[1024px] mx-auto p-5 ">
        <div className="container max-w-[512px] mx-auto">
          
        </div>

        <Predictions predictions={predictions} />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const predictions = await getRecentPredictions();
  return { props: { predictions } };
}
