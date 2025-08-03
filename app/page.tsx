import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Hero from "./landing/Hero";
import Features from "./landing/Features";
import Testimonials from "./landing/Testimonials";
import Footer from "./landing/Footer";
import DashboardPreview from "./landing/DashboardPreview";

// import React, { useEffect, useState } from "react";
// import VideoFeed from "../components/VideoFeed";
// import { IVideo } from "@/models/Video";
// import { apiClient } from "@/lib/api-client";

export default async function Home() {

  // const session = await getServerSession(authOptions);
  // if(session) {
  //   redirect("/feed");
  // }


  return (

    <main className="">
      <Hero />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <Footer />
    </main>


    // <main className="container mx-auto px-4 py-8">
    //   <h1 className="text-3xl font-bold mb-8">ImageKit ReelsPro</h1>
    //   <VideoFeed videos={videos} />
    // </main>
  );
}