/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card, Image } from "@heroui/react";
import {
  Play,
  Upload,
  Sparkles,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
// import Link from "next/link";

const Hero = () => {
  const { scrollY } = useScroll();

  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const yOrb1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const yOrb2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const yOrb3 = useTransform(scrollY, [0, 1000], [0, 100]);
  const yContent = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <SimpleHeader />

      {/* Animated gradient background with parallax */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 bg-gradient-to-br from-background via-purple-950/20 to-pink-950/20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)]"></div>
      </motion.div>

      {/* Floating orbs with parallax */}
      <motion.div
        style={{ y: yOrb1 }}
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        style={{ y: yOrb2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        style={{ y: yOrb3 }}
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      {/* Grid pattern overlay */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div> */}

      {/* Floating social media elements with parallax */}
      {[
        {
          icon: Heart,
          top: "15%",
          left: "10%",
          delay: 0,
          yOffset: yOrb1,
          color: "text-secondary",
        },
        {
          icon: MessageCircle,
          top: "25%",
          right: "15%",
          delay: 0.5,
          yOffset: yOrb2,
          color: "text-primary",
        },
        {
          icon: Share2,
          bottom: "30%",
          left: "8%",
          delay: 1,
          yOffset: yOrb3,
          color: "text-accent",
        },
        {
          icon: Bookmark,
          bottom: "20%",
          right: "12%",
          delay: 1.5,
          yOffset: yOrb1,
          color: "text-secondary",
        },
        {
          icon: Play,
          top: "40%",
          left: "5%",
          delay: 2,
          yOffset: yOrb2,
          color: "text-primary",
        },
        {
          icon: TrendingUp,
          top: "60%",
          right: "8%",
          delay: 2.5,
          yOffset: yOrb3,
          color: "text-accent",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          style={{
            y: item.yOffset,
            ...Object.fromEntries(
              Object.entries({
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
              }).filter(([, v]) => v)
            ),
          }}
          className="absolute hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <div className="relative">
            <div
              className={`absolute inset-0 ${item.color} blur-xl opacity-50`}
            ></div>
            <item.icon className={`h-8 w-8 ${item.color} relative`} />
          </div>
        </motion.div>
      ))}

      {/* Grid pattern overlay with parallax */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"
      ></motion.div>

      <motion.div
        style={{ y: yContent, opacity, scale }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20"
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 rounded-full mb-8"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              The Future of Video Content Creation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Create. Share.
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Go Viral
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join millions of creators building their audience with our powerful
            platform. Upload, edit, and share stunning reels that captivate the
            world.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-2xl shadow-primary/50 transition-all duration-300 transform hover:scale-105 border-0 rounded-xl group"
            >
              <Upload className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
              Start Creating Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-border bg-card/50 backdrop-blur-sm hover:bg-card text-foreground px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105 rounded-xl group"
            >
              <Play className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Video,
                number: "10M+",
                label: "Videos Created",
                gradient: "from-primary to-accent",
              },
              {
                icon: TrendingUp,
                number: "5M+",
                label: "Active Creators",
                gradient: "from-secondary to-primary",
              },
              {
                icon: Play,
                number: "100M+",
                label: "Monthly Views",
                gradient: "from-accent to-secondary",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border/50 group-hover:border-primary/50 transition-all">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </motion.div>

      {/* Floating Video Cards */}
      {/* <motion.div
        initial={{ opacity: 0, x: -100, rotate: -20 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-20 left-8 hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-50 rounded-3xl"></div>
          <div className="relative bg-card/80 backdrop-blur-xl border-2 border-primary/30 rounded-3xl shadow-2xl p-4 w-56 transform hover:rotate-0 transition-transform duration-500">
            <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl h-48 mb-3 flex items-center justify-center ">
              <Play className="h-12 w-12 text-white" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full"></div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Trending Now
                </div>
                <div className="text-xs text-muted-foreground">2.4M views</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -20 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-20 left-8 hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-50 rounded-3xl"></div>
          <Card
            isFooterBlurred
            radius="lg"
            className="bg-card/80 backdrop-blur-xl border-3 border-primary/30 rounded-3xl shadow-2xl p-3 w-60 h-68 relative overflow-hidden"
          >
            <Image
              alt="Woman listing to music"
              src="https://heroui.com/images/hero-card.jpeg"
              loading="eager"
              isBlurred={false}
              isZoomed={true}
              removeWrapper
              className="w-full h-full object-cover !opacity-100"
            />
            {/* <CardFooter className="absolute bottom-2 left-2 right- z-10 py-1 flex items-center space-x-3 rounded-large border border-white/20 before:rounded-xl before:bg-white/10 backdrop-blur-md shadow-small">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full"></div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Trending Now
                </div>
                <div className="text-xs text-muted-foreground">2.4M views</div>
              </div>
            </CardFooter> */}
          </Card>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -20 }}
        animate={{ opacity: 1, x: 0, rotate: 10 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-13 left-16 hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-50 rounded-3xl"></div>
          <Card
            isFooterBlurred
            radius="lg"
            className="bg-card/80 backdrop-blur-xl border-3 border-primary/30 rounded-3xl shadow-2xl p-3 w-60 h-68 relative overflow-hidden"
          >
            <Image
              alt="Woman listing to music"
              src="https://heroui.com/images/hero-card.jpeg"
              loading="eager"
              isBlurred={false}
              isZoomed={true}
              removeWrapper
              className="w-full h-full object-cover !opacity-100"
            />
            {/* <CardFooter className="absolute bottom-2 left-2 right- z-10 py-1 flex items-center space-x-3 rounded-large border border-white/20 before:rounded-xl before:bg-white/10 backdrop-blur-md shadow-small">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full"></div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Trending Now
                </div>
                <div className="text-xs text-muted-foreground">2.4M views</div>
              </div>
            </CardFooter> */}
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 20 }}
        animate={{ opacity: 1, x: 0, rotate: 6 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute top-32 right-8 hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-50 rounded-3xl"></div>
          <Card
            isFooterBlurred
            radius="lg"
            className="bg-card/80 backdrop-blur-xl border-3 border-primary/30 rounded-3xl shadow-2xl p-3 w-60 h-68 relative overflow-hidden"
          >
            <Image
              alt="Woman listing to music"
              src="https://heroui.com/images/hero-card.jpeg"
              loading="eager"
              isBlurred={false}
              isZoomed={true}
              removeWrapper
              className="w-full h-full object-cover !opacity-100"
            />
            {/* <CardFooter className="absolute bottom-2 left-2 right- z-10 py-1 flex items-center space-x-3 rounded-large border border-white/20 before:rounded-xl before:bg-white/10 backdrop-blur-md shadow-small">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full"></div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Trending Now
                </div>
                <div className="text-xs text-muted-foreground">2.4M views</div>
              </div>
            </CardFooter> */}
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 20 }}
        animate={{ opacity: 1, x: 0, rotate: 6 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute top-32 right-8 hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-50 rounded-3xl"></div>
          <Card
            isFooterBlurred
            radius="lg"
            className="bg-card/80 backdrop-blur-xl border-3 border-primary/30 rounded-3xl shadow-2xl p-3 w-60 h-68 relative overflow-hidden"
          >
            <Image
              alt="Woman listing to music"
              src="https://heroui.com/images/hero-card.jpeg"
              loading="eager"
              isBlurred={false}
              isZoomed={true}
              removeWrapper
              className="w-full h-full object-cover !opacity-100"
            />
            {/* <CardFooter className="absolute bottom-2 left-2 right- z-10 py-1 flex items-center space-x-3 rounded-large border border-white/20 before:rounded-xl before:bg-white/10 backdrop-blur-md shadow-small">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full"></div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Trending Now
                </div>
                <div className="text-xs text-muted-foreground">2.4M views</div>
              </div>
            </CardFooter> */}
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
