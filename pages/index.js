import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useState, useEffect } from "react";
import Predictions from "components/predictions";
import Header from "components/header";
import Error from "components/error";
import Welcome from "components/welcome";
import uploadFile from "lib/upload";
import naughtyWords from "naughty-words";
import Script from "next/script";
import seeds from "lib/seeds";
import pkg from "../package.json";
import sleep from "lib/sleep";

export default function Home() {
  const [error, setError] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [predictions, setPredictions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [scribbleExists, setScribbleExists] = useState(false);
  const [seed] = useState(seeds[Math.floor(Math.random() * seeds.length)]);
  const [initialPrompt] = useState(seed.prompt);
  const [scribble, setScribble] = useState(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let prediction = ""
    // track submissions so we can show a spinner while waiting for the next prediction to be created
    setSubmissionCount(submissionCount + 1);

    const prompt = e.target.prompt.value
      .split(/\s+/)
      .map((word) => (naughtyWords.en.includes(word) ? "something" : word))
      .join(" ");

    setError(null);
    setIsProcessing(true);

    const fileUrl = await uploadFile(scribble);
    
    const body = {
      prompt,
      image: fileUrl,
      structure: "scribble",
      replicate_api_token: localStorage.getItem("replicate_api_token"),
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    prediction = await response.json();
      
    setPredictions((predictions) => ({
      ...predictions,
      [prediction.id]: prediction,
    }));

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(500);
      
      const response = await fetch("/api/predictions/" + prediction.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "replicate_api_token"
          )}`,
        },
      });
      let auxprediction = await response.json();
      if (auxprediction){
        prediction.status = auxprediction.status
        setPredictions((predictions) => ({
          ...predictions,
          [prediction.id]: auxprediction,
        }));
      }
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
    }

    setIsProcessing(false);
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("replicate_api_token", e.target[0].value);
    setWelcomeOpen(false);
  };

  useEffect(() => {
    const replicateApiToken = localStorage.getItem("replicate_api_token");

    if (replicateApiToken) {
      setWelcomeOpen(false);
    } else {
      localStorage.setItem("replicate_api_token", process.env.REPLICATE_API_TOKEN)
      setWelcomeOpen(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pkg.appName}</title>
        <meta name="description" content={pkg.appMetaDescription} />
        <meta property="og:title" content={pkg.appName} />
        <meta property="og:description" content={pkg.appMetaDescription} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main className="container max-w-[1024px] mx-auto p-5 ">
        {welcomeOpen ? (
          <Welcome handleTokenSubmit={handleTokenSubmit} />
        ) : (
          <div className="container max-w-[512px] mx-auto">
            <Header />

            <Canvas
              startingPaths={seed.paths}
              onScribble={setScribble}
              scribbleExists={scribbleExists}
              setScribbleExists={setScribbleExists}
            />

            <PromptForm
              initialPrompt={initialPrompt}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
              scribbleExists={scribbleExists}
            />

            <Error error={error} />
          </div>
        )}

        <Predictions
          predictions={predictions}
          isProcessing={isProcessing}
          submissionCount={submissionCount}
        />
      </main>

    </>
  );
}
