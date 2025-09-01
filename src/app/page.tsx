"use client";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import AppPieChart from "@/components/AppPieChart";
import {
   MessageSquare,
   Users,
   TrendingUp,
   Heart,
   Shield,
   Send,
} from "lucide-react";

import messages from "@/messages.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
   fadeInUp,
   staggerContainer,
   scaleIn,
   bounce,
   slideInRightSlow,
} from "@/lib/animations";

const Home = () => {
   // Refs for scroll animations
   const heroRef = useRef(null);
   const carouselRef = useRef(null);
   const howItWorksRef = useRef(null);
   const featuresRef = useRef(null);
   const statsRef = useRef(null);
   const ctaRef = useRef(null);

   // Check if elements are in view
   const heroInView = useInView(heroRef, { margin: "0px" });
   const carouselInView = useInView(carouselRef, {
      margin: "-120px",
   });
   const howItWorksInView = useInView(howItWorksRef, {
      margin: "-120px",
   });
   const featuresInView = useInView(featuresRef, {
      margin: "-120px",
   });
   const statsInView = useInView(statsRef, { margin: "-120px" });
   const ctaInView = useInView(ctaRef, { margin: "-10px" });
   // Dummy data for statistics
   const stats = [
      {
         title: "Total Messages",
         value: "2,247",
         icon: MessageSquare,
         color: "text-blue-500",
         bgColor: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
         title: "Active Users",
         value: "892",
         icon: Users,
         color: "text-green-500",
         bgColor: "bg-green-50 dark:bg-green-900/20",
      },
      {
         title: "Satisfaction Rate",
         value: "94%",
         icon: Heart,
         color: "text-pink-500",
         bgColor: "bg-pink-50 dark:bg-pink-900/20",
      },
      {
         title: "Growth This Month",
         value: "+28%",
         icon: TrendingUp,
         color: "text-orange-500",
         bgColor: "bg-orange-50 dark:bg-orange-900/20",
      },
   ];

   // Dummy data for pie chart
   const pieChartData = [
      { name: "Positive", value: 45, fill: "var(--chart-5)" },
      { name: "Neutral", value: 30, fill: "var(--chart-2)" },
      { name: "Questions", value: 15, fill: "var(--chart-3)" },
      { name: "Feedback", value: 10, fill: "var(--chart-4)" },
   ];

   return (
      <>
         <main className="flex flex-col h-auto">
            {/* First Section: Two Containers */}
            <section
               ref={heroRef}
               className="flex flex-col md:flex-row py-12 px-4 md:px-24">
               <div className="w-full md:w-1/2 flex flex-col items-center">
                  {/* Left Container: Hero Content */}
                  <motion.div
                     className="text-left"
                     initial="hidden"
                     animate={heroInView ? "visible" : "hidden"}
                     variants={staggerContainer}>
                     <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-6"
                        variants={fadeInUp}>
                        Welcome to Mystery Messages
                     </motion.h1>
                     <motion.p
                        className="text-xl md:text-2xl mb-8 opacity-90"
                        variants={fadeInUp}>
                        Where anonymous conversations create meaningful
                        connections
                     </motion.p>
                     <motion.div
                        className="backdrop-blur-sm rounded-2xl p-8 mb-8"
                        variants={fadeInUp}>
                        <p className="text-lg mb-6">
                           Share your thoughts freely without revealing your
                           identity. Discover what others really think in a
                           safe, anonymous space.
                        </p>
                        <div className="flex md:gap-4 gap-2">
                           <motion.div
                              variants={fadeInUp}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              <Button className="md:px-8 py-6 text-lg">
                                 <Link href="/signup">Get Started</Link>
                              </Button>
                           </motion.div>
                           <motion.div
                              variants={fadeInUp}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              <Button
                                 className="md:px-8 py-6 text-lg"
                                 variant="outline">
                                 <Link href="/u">Message Now</Link>
                              </Button>
                           </motion.div>
                        </div>
                     </motion.div>
                  </motion.div>
               </div>
               {/* Right Container: Pie Chart */}
               <motion.div
                  className="flex flex-col justify-center w-full md:w-1/2 min-h-40"
                  initial="hidden"
                  animate={heroInView ? "visible" : "hidden"}
                  variants={slideInRightSlow}>
                  <AppPieChart data={pieChartData} totalMessages={2476} />
               </motion.div>
            </section>

            {/* Second Section: Carousel */}
            <section ref={carouselRef} className="py-12 px-4 md:px-24 w-full">
               <motion.div
                  className="max-w-4xl mx-auto"
                  initial="hidden"
                  animate={carouselInView ? "visible" : "hidden"}
                  variants={staggerContainer}>
                  <motion.h2
                     className="text-4xl font-bold text-center mb-12"
                     variants={fadeInUp}>
                     What People Are Saying
                  </motion.h2>
                  <Carousel
                     plugins={[Autoplay({ delay: 3000 })]}
                     className="w-full max-w-2xl mx-auto">
                     <CarouselContent>
                        {messages.map((message, index) => (
                           <CarouselItem key={index}>
                              <motion.div
                                 className="p-4"
                                 initial="hidden"
                                 animate={carouselInView ? "visible" : "hidden"}
                                 variants={scaleIn}
                                 transition={{ delay: index * 0.1 }}>
                                 <Card className="border-0 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                                    <CardHeader>
                                       <CardTitle className="text-lg">
                                          {message.title}
                                       </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                       <p className="text-accent-foreground text-base leading-relaxed">
                                          &ldquo;{message.content}&rdquo;
                                       </p>
                                       <p className="text-sm text-muted-foreground mt-4">
                                          {message.received}
                                       </p>
                                    </CardContent>
                                 </Card>
                              </motion.div>
                           </CarouselItem>
                        ))}
                     </CarouselContent>
                     <CarouselPrevious className="ml-12" />
                     <CarouselNext className="mr-12" />
                  </Carousel>
               </motion.div>
            </section>

            {/* Section 2: How It Works */}
            <section
               ref={howItWorksRef}
               className="py-12 px-4 md:px-8 w-full h-auto overflow-x-hidden overflow-y-hidden">
               <motion.div
                  className="max-w-6xl mx-auto"
                  initial="hidden"
                  animate={howItWorksInView ? "visible" : "hidden"}
                  variants={staggerContainer}>
                  <Card className="border-none bg-transparent">
                     <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold">
                           How It Works
                        </CardTitle>
                        <CardDescription>
                           Discover the magic of anonymous conversations
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="flex flex-wrap gap-6 justify-center">
                        <motion.div
                           className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4"
                           variants={fadeInUp}>
                           <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-green-500 font-bold">
                                 1
                              </span>
                           </div>
                           <div className="text-center md:text-left max-w-sm">
                              <h3 className="font-semibold">
                                 Create Your Profile
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                 Sign up and get a unique username to share with
                                 friends and connections
                              </p>
                           </div>
                        </motion.div>

                        <motion.div
                           className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4"
                           variants={fadeInUp}>
                           <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-500 font-bold">2</span>
                           </div>
                           <div className="text-center md:text-left max-w-sm">
                              <h3 className="font-semibold">Share Your Link</h3>
                              <p className="text-sm text-muted-foreground">
                                 Send your profile link to others so they can
                                 send you anonymous messages
                              </p>
                           </div>
                        </motion.div>

                        <motion.div
                           className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4"
                           variants={fadeInUp}>
                           <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-500 font-bold">
                                 3
                              </span>
                           </div>
                           <div className="text-center md:text-left max-w-sm">
                              <h3 className="font-semibold">
                                 Receive Messages
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                 Get honest feedback, compliments, and thoughts
                                 from people in your life
                              </p>
                           </div>
                        </motion.div>

                        <motion.div
                           className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-4"
                           variants={fadeInUp}>
                           <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-orange-500 font-bold">
                                 4
                              </span>
                           </div>
                           <div className="text-center md:text-left max-w-sm">
                              <h3 className="font-semibold">Stay Anonymous</h3>
                              <p className="text-sm text-muted-foreground">
                                 All messages are completely anonymous - send
                                 and receive with confidence
                              </p>
                           </div>
                        </motion.div>
                     </CardContent>
                     <CardFooter>
                        <motion.div
                           className="bg-accent/50 rounded-lg p-4 mt-6 mx-auto"
                           variants={fadeInUp}>
                           <div className="flex items-center space-x-2">
                              <Shield className="h-8 w-8 text-green-500" />
                              <span className="text-md font-medium">
                                 100% Secure & Private
                              </span>
                           </div>
                           <p className="text-sm text-muted-foreground mt-1">
                              Your privacy is our priority. All messages are
                              encrypted and anonymous.
                           </p>
                        </motion.div>
                     </CardFooter>
                  </Card>
               </motion.div>
            </section>

            {/* Third Section: Feature Section */}
            <section ref={featuresRef} className="py-16 px-4 lg:px-24">
               <motion.div
                  className="max-w-6xl mx-auto"
                  initial="hidden"
                  animate={featuresInView ? "visible" : "hidden"}
                  variants={fadeInUp}>
                  <h2 className="text-3xl font-bold text-center mb-12">
                     Why Choose Whisper Box?
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                     {[
                        {
                           icon: Shield,
                           title: "Complete Anonymity",
                           description:
                              "Share your thoughts without revealing your identity",
                           bgColor: "bg-blue-100 dark:bg-blue-900",
                           iconColor: "text-blue-600 dark:text-blue-400",
                        },
                        {
                           icon: Heart,
                           title: "Honest Feedback",
                           description:
                              "Get genuine thoughts and feedback from people who know you",
                           bgColor: "bg-green-100 dark:bg-green-900",
                           iconColor: "text-green-600 dark:text-green-400",
                        },
                        {
                           icon: Send,
                           title: "Easy to Use",
                           description:
                              "Simple interface makes sending and receiving messages effortless",
                           bgColor: "bg-purple-100 dark:bg-purple-900",
                           iconColor: "text-purple-600 dark:text-purple-400",
                        },
                     ].map((feature, index) => (
                        <motion.div
                           key={index}
                           className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
                           variants={fadeInUp}
                           whileHover={{ y: -5, scale: 1.02 }}>
                           <div
                              className={`${feature.bgColor} p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                              <feature.icon
                                 className={`h-8 w-8 ${feature.iconColor}`}
                              />
                           </div>
                           <h3 className="font-semibold text-xl mb-3">
                              {feature.title}
                           </h3>
                           <p className="text-gray-600 dark:text-gray-300">
                              {feature.description}
                           </p>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            </section>

            {/* Statistics Section */}
            <section ref={statsRef} className="py-12 px-4 md:px-24">
               <motion.div
                  className="max-w-6xl mx-auto"
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                  variants={fadeInUp}>
                  <h2 className="text-3xl font-bold text-center mb-12">
                     Platform Insights
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                     {stats.map((stat, index) => (
                        <motion.div
                           key={stat.title}
                           variants={fadeInUp}
                           transition={{ delay: index * 0.1 }}
                           whileHover={{ y: -5 }}>
                           <Card className="shadow-lg border-0 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                 <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                 </CardTitle>
                                 <div
                                    className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon
                                       className={`h-5 w-5 ${stat.color}`}
                                    />
                                 </div>
                              </CardHeader>
                              <CardContent>
                                 <div className="text-2xl font-bold">
                                    <AnimatedCounter
                                       value={stat.value}
                                       shouldAnimate={statsInView}
                                    />
                                 </div>
                              </CardContent>
                           </Card>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            </section>

            {/* Call to Action */}
            <section ref={ctaRef} className="py-20 px-4 md:px-24 text-center">
               <motion.div
                  className="max-w-3xl mx-auto"
                  initial="hidden"
                  animate={ctaInView ? "visible" : "hidden"}
                  variants={bounce}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                     Ready to Start Your Anonymous Journey?
                  </h2>
                  <p className="text-xl mb-8">
                     Join thousands of users who have discovered the power of
                     honest, anonymous conversations
                  </p>
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}>
                     <Button className="px-8 py-6 text-lg">
                        <Link href="/signup">Get Started Now</Link>
                     </Button>
                  </motion.div>
               </motion.div>
            </section>

            {/* Copyright Footer */}
            <footer className="py-8 px-4 md:px-24  text-center">
               <div className="max-w-6xl mx-auto">
                  <p className="">
                     © {new Date().getFullYear()} Whisper Box. All rights
                     reserved.
                  </p>
               </div>
            </footer>
         </main>
      </>
   );
};

export default Home;
