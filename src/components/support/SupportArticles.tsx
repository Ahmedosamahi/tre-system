
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Eye } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Getting Started with Your Dashboard',
    description: 'Learn how to navigate and use all the features of your logistics dashboard.',
    readTime: '5 min read',
    views: '2.3k views',
    category: 'Tutorial',
    isNew: true
  },
  {
    id: 2,
    title: 'Advanced Order Management Tips',
    description: 'Discover advanced features for managing bulk orders and automated workflows.',
    readTime: '8 min read',
    views: '1.8k views',
    category: 'Guide',
    isNew: false
  },
  {
    id: 3,
    title: 'Understanding Delivery Analytics',
    description: 'Make sense of your delivery metrics and improve your logistics performance.',
    readTime: '6 min read',
    views: '1.2k views',
    category: 'Analytics',
    isNew: true
  },
  {
    id: 4,
    title: 'API Integration Guide',
    description: 'Step-by-step guide to integrate our API with your existing systems.',
    readTime: '12 min read',
    views: '950 views',
    category: 'Technical',
    isNew: false
  }
];

export const SupportArticles = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Support Articles & Guides</h2>
        <p className="text-gray-600">Explore our latest tutorials and documentation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-4">
              {/* Category and New Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {article.category}
                </span>
                {article.isNew && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    New
                  </span>
                )}
              </div>

              {/* Title and Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.description}
                </p>
              </div>

              {/* Meta Information */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views}
                </div>
              </div>

              {/* Read More Button */}
              <Button variant="outline" size="sm" className="w-full group">
                Read Article
                <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* View All Articles Button */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          View All Articles
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
