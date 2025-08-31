import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  readMore: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Crude Compass",
    description: "Why Should We Care About Oil Prices? For decades, crude oil has been the heartbeat of the global economy. High oil prices shapes inflation cycles, and drives geopolitical power plays. Yet for long-term investors oil is more than just a commodity — it's a signal, a hedge, and sometimes a storm. Knowing why oil prices change helps decide when to hedge inflation, when to own energy stocks or shift into safer assets. In this breakdown, we'll walk through the main forces at work, using",
    readMore: "Read More"
  },
  {
    id: "2",
    title: "Global Currency Leadership",
    description: "The Rise and Fall of Global Superpowers Through the Lens of Reserve Currency Domination Throughout history economic dominance has aligned with military might, technological leadership, and cultural influence – but perhaps the clearest signal of a nation's global dominance is when its currency becomes the world's reserve currency. Since 1450, the world has witnessed a consistent transition of global reserve currencies every 80–110 years on average. Each transition marked not just a shift in m",
    readMore: "Read More"
  },
  {
    id: "3",
    title: "The PE Ratio Debate, Decoded",
    description: "At Ooda, every investment thesis is tested through data, not intuition. As part of Ooda's investment process, we conducted a detailed study to revisit a classic investing question: Do low PE (value) stocks consistently outperform high PE (growth) stocks? And does this relationship hold uniformly across different market capitalizations? This blog outlines the methodology, key findings, and implications of this study, based on a robust 15-year backtest. Study Design and Methodology",
    readMore: "Read More"
  }
];

export default function Home() {
  return (
    <div className="w-full py-12 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light mb-2" style={{ fontFamily: 'serif', color: 'rgb(148 92 57)' }}>
          Blogs
        </h1>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
        {blogPosts.map((post) => (
          <Card key={post.id} className="border-0 shadow-none bg-transparent hover:bg-primary transition-colors duration-200 cursor-pointer p-4">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl font-medium mb-4" style={{ fontFamily: 'serif', color: 'rgb(148 92 57)' }}>
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-8">
                {post.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <Button
                variant="ghost"
                className="p-0 h-auto text-gray-600 hover:text-gray-800 font-normal"
              >
                <ArrowUpRight className="w-4 h-4 mr-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Blogs Button */}
      <div className="text-center">
        <Button
          className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-2 font-medium"
        >
          All Blogs
        </Button>
      </div>
    </div>
  );
}
