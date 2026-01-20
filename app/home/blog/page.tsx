'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Calendar, User, ArrowRight, Filter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    id: 1,
    title: "Smart Store Management: Leveraging Technology for Better Operations",
    excerpt: "Discover how modern store management systems are revolutionizing retail operations with real-time analytics, automated inventory tracking, and enhanced customer insights.",
    content: "Today's store managers have access to powerful technology that transforms how they operate. From AI-powered inventory management to customer behavior analytics, smart systems are helping retailers optimize every aspect of their business...",
    author: "Priya Sharma",
    date: "2025-01-15",
    category: "Technology",
    tags: ["Store Management", "Analytics", "Automation"],
    image: "/images/Service1.jpg",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Inventory Optimization: Reduce Costs and Increase Profits",
    excerpt: "Master the art of inventory management with proven strategies that minimize waste, prevent stockouts, and maximize your store's profitability.",
    content: "Effective inventory management is crucial for store success. Learn how to implement just-in-time ordering, ABC analysis, and demand forecasting to optimize your stock levels and boost profitability...",
    author: "Rajesh Kumar",
    date: "2025-01-12",
    category: "Operations",
    tags: ["Inventory", "Cost Reduction", "Profit Optimization"],
    image: "/images/Service2.jpg",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Building Customer Loyalty Through Exceptional Service",
    excerpt: "Learn proven strategies to create memorable customer experiences that drive repeat business and build long-term loyalty for your store.",
    content: "Customer loyalty is the foundation of sustainable retail success. Discover how to train your team, implement loyalty programs, and create personalized experiences that keep customers coming back...",
    author: "Anita Patel",
    date: "2025-01-10",
    category: "Customer Service",
    tags: ["Customer Loyalty", "Service Excellence", "Retention"],
    image: "/images/service3.jpg",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Staff Management: Building High-Performance Retail Teams",
    excerpt: "Effective staff management strategies that improve productivity, reduce turnover, and create a positive work environment in your store.",
    content: "Your team is your most valuable asset. Learn how to recruit, train, and motivate retail staff while creating schedules that optimize coverage and control labor costs...",
    author: "Vikram Singh",
    date: "2025-01-08",
    category: "Management",
    tags: ["Staff Management", "Team Building", "Management"],
    image: "/images/Service4.jpg",
    readTime: "8 min read"
  },
  {
    id: 5,
    title: "Financial Management for Store Owners: Key Metrics That Matter",
    excerpt: "Understanding essential financial metrics and KPIs that help you make informed decisions and drive your store's profitability.",
    content: "Financial success requires more than just tracking sales. Learn about gross margins, inventory turnover, customer acquisition costs, and other critical metrics that impact your bottom line...",
    author: "Meera Gupta",
    date: "2025-01-05",
    category: "Finance",
    tags: ["Financial Management", "KPIs", "Profitability"],
    image: "/images/Service5.jpg",
    readTime: "9 min read"
  },
  {
    id: 6,
    title: "Store Layout and Visual Merchandising: Maximize Sales Per Square Foot",
    excerpt: "Strategic store design and merchandising techniques that guide customer flow, increase dwell time, and boost average transaction values.",
    content: "Your store layout is a powerful sales tool. Discover how to optimize product placement, create compelling displays, and design customer journeys that maximize revenue per square foot...",
    author: "Arjun Reddy",
    date: "2025-01-03",
    category: "Merchandising",
    tags: ["Store Layout", "Visual Merchandising", "Sales Optimization"],
    image: "/images/Service6.jpg",
    readTime: "6 min read"
  },
  {
    id: 7,
    title: "Loss Prevention: Protecting Your Store's Profitability",
    excerpt: "Comprehensive strategies to reduce shrinkage, prevent theft, and protect your inventory while maintaining a welcoming customer environment.",
    content: "Retail shrinkage can significantly impact your bottom line. Learn about modern loss prevention techniques, security systems, and staff training that protect your assets without compromising customer experience...",
    author: "Kavya Nair",
    date: "2025-01-01",
    category: "Security",
    tags: ["Loss Prevention", "Security", "Shrinkage Reduction"],
    image: "/images/Service1.jpg",
    readTime: "7 min read"
  },
  {
    id: 8,
    title: "Seasonal Planning: Maximizing Revenue Throughout the Year",
    excerpt: "Strategic planning techniques to capitalize on seasonal trends, manage inventory cycles, and optimize marketing campaigns for peak performance.",
    content: "Successful retailers think seasonally. Learn how to plan inventory, staffing, and marketing campaigns that align with seasonal demand patterns and maximize revenue opportunities...",
    author: "Rohit Agarwal",
    date: "2023-12-28",
    category: "Planning",
    tags: ["Seasonal Planning", "Revenue Optimization", "Marketing"],
    image: "/images/Service2.jpg",
    readTime: "8 min read"
  }
]

const categories = ["All", "Technology", "Operations", "Customer Service", "Management", "Finance", "Merchandising", "Security", "Planning"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const handleTagClick = (tag: string) => {
    // Check if the tag matches a category
    const matchingCategory = categories.find(cat => cat.toLowerCase() === tag.toLowerCase())
    if (matchingCategory) {
      setSelectedCategory(matchingCategory)
      setSearchTerm("")
    } else {
      setSearchTerm(tag)
      setSelectedCategory("All")
    }
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setSearchTerm("")
  }

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      // If there's a search term, only filter by search
      if (searchTerm) {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
               post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      }
      // Otherwise, filter by category
      return selectedCategory === "All" || post.category === selectedCategory
    })
  }, [searchTerm, selectedCategory])

  const featuredPost = blogPosts[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative text-gray-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 mt-6">Store Manager Hub</h1>
            <p className="text-xl mb-8 opacity-90">
              Your ultimate resource for retail management success - expert insights, proven strategies, and actionable tips for store owners and managers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Browse Articles
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <Card className="max-w-6xl mx-auto overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-full">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 text-black">Featured</Badge>
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge 
                  className="w-fit mb-4 cursor-pointer hover:bg-blue-100 transition-colors" 
                  onClick={() => handleCategoryClick(featuredPost.category)}
                >
                  {featuredPost.category}
                </Badge>
                <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {featuredPost.date}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                {/* <Button className="w-fit">
                  Read Full Article <ArrowRight size={16} className="ml-2" />
                </Button> */}
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>
            
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Latest Articles</h2>
              <p className="text-gray-600">{filteredPosts.length} articles found</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => handleCategoryClick(post.category)}
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-lg mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 text-gray-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90">
              Get weekly store management tips, industry insights, and exclusive resources delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white text-black"
              />
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}