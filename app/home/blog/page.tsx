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
    title: "Revolutionizing Store Management with AI-Powered Analytics",
    excerpt: "Discover how artificial intelligence is transforming retail operations and helping store managers make data-driven decisions.",
    content: "In today's competitive retail landscape, store managers need every advantage they can get. AI-powered analytics are revolutionizing how we understand customer behavior, optimize inventory, and predict trends...",
    author: "Sarah Johnson",
    date: "2024-01-15",
    category: "Technology",
    tags: ["AI", "Analytics", "Retail"],
    image: "/images/Service1.jpg",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Best Practices for Inventory Management in 2024",
    excerpt: "Learn the latest strategies and tools for efficient inventory management that can reduce costs and improve customer satisfaction.",
    content: "Effective inventory management is the backbone of successful retail operations. With the right strategies and tools, store managers can significantly reduce costs while improving customer satisfaction...",
    author: "Michael Chen",
    date: "2024-01-12",
    category: "Operations",
    tags: ["Inventory", "Management", "Best Practices"],
    image: "/images/Service2.jpg",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Customer Experience: The Key to Retail Success",
    excerpt: "Explore how focusing on customer experience can drive sales, build loyalty, and differentiate your store from competitors.",
    content: "In an era where customers have countless options, providing exceptional customer experience has become the ultimate differentiator. Store managers who prioritize CX see significant improvements in sales and loyalty...",
    author: "Emily Rodriguez",
    date: "2024-01-10",
    category: "Customer Service",
    tags: ["Customer Experience", "Sales", "Loyalty"],
    image: "/images/service3.jpg",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Digital Transformation in Retail: A Complete Guide",
    excerpt: "Navigate the digital transformation journey with practical steps and real-world examples from successful retail implementations.",
    content: "Digital transformation is no longer optional for retail businesses. This comprehensive guide provides store managers with actionable insights and proven strategies for successful digital adoption...",
    author: "David Park",
    date: "2024-01-08",
    category: "Digital",
    tags: ["Digital Transformation", "Technology", "Innovation"],
    image: "/images/Service4.jpg",
    readTime: "10 min read"
  },
  {
    id: 5,
    title: "Sustainable Retail Practices That Drive Profits",
    excerpt: "Discover how implementing sustainable practices can reduce costs, attract conscious consumers, and boost your bottom line.",
    content: "Sustainability isn't just good for the planet—it's good for business. Forward-thinking store managers are implementing eco-friendly practices that reduce operational costs and attract environmentally conscious customers...",
    author: "Lisa Thompson",
    date: "2024-01-05",
    category: "Sustainability",
    tags: ["Sustainability", "Profit", "Environment"],
    image: "/images/Service5.jpg",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "The Future of Point-of-Sale Systems",
    excerpt: "Explore emerging POS technologies and how they're reshaping the checkout experience for both customers and staff.",
    content: "Point-of-sale systems have evolved far beyond simple transaction processing. Modern POS solutions integrate with inventory management, customer relationship systems, and analytics platforms...",
    author: "Robert Kim",
    date: "2024-01-03",
    category: "Technology",
    tags: ["POS", "Technology", "Innovation"],
    image: "/images/Service6.jpg",
    readTime: "6 min read"
  }
]

const categories = ["All", "Technology", "Operations", "Customer Service", "Digital", "Sustainability"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const featuredPost = blogPosts[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative text-gray-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Store Manager Insights</h1>
            <p className="text-xl mb-8 opacity-90">
              Expert insights, best practices, and industry trends for modern retail management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-300">
                Latest Articles
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-300">
                Subscribe to Newsletter
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
                <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button className="w-fit">
                  Read Full Article <ArrowRight size={16} className="ml-2" />
                </Button>
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
                    onClick={() => setSelectedCategory(category)}
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
                      <Badge>{post.category}</Badge>
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
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
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
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest insights and best practices delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white text-black"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}