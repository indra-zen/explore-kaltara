import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { Calendar, User, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import articles from '@/data/articles.json';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - Explore Kaltara',
    };
  }

  return {
    title: article.seo.title,
    description: article.seo.description,
    keywords: article.seo.keywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter(a => 
      a.id !== article.id && 
      (a.category === article.category || 
       a.tags.some(tag => article.tags.includes(tag)))
    )
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }

      if (paragraph.includes('**') && paragraph.includes('Rating:')) {
        const parts = paragraph.split('**');
        return (
          <div key={index} className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return <strong key={partIndex} className="text-blue-800">{part}</strong>;
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }

      if (paragraph.startsWith('1. ') || paragraph.includes('\n1. ')) {
        const listItems = paragraph.split(/\n?\d+\.\s/).filter(item => item.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-4 text-gray-700">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {item.includes('**') ? (
                  item.split('**').map((part, partIndex) => 
                    partIndex % 2 === 1 ? 
                    <strong key={partIndex} className="text-gray-800">{part}</strong> : 
                    part
                  )
                ) : item}
              </li>
            ))}
          </ol>
        );
      }

      if (paragraph.includes('- **') || paragraph.includes('* **')) {
        const listItems = paragraph.split(/\n[*-]\s/).filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-gray-700">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {item.includes('**') ? (
                  item.split('**').map((part, partIndex) => 
                    partIndex % 2 === 1 ? 
                    <strong key={partIndex} className="text-gray-800">{part}</strong> : 
                    part
                  )
                ) : item}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {paragraph.includes('**') ? (
            paragraph.split('**').map((part, partIndex) => 
              partIndex % 2 === 1 ? 
              <strong key={partIndex} className="text-gray-800">{part}</strong> : 
              part
            )
          ) : paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">Beranda</Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-gray-500 hover:text-blue-600">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category === 'travel-tips' ? 'Travel Tips' :
                   article.category === 'destinations' ? 'Destinasi' :
                   article.category === 'food-culture' ? 'Kuliner & Budaya' : article.category}
                </span>
                {article.featured && (
                  <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold text-yellow-900">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-200 space-x-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(article.publishedAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {article.readTime} min read
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <Link 
              href="/blog" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Blog
            </Link>
            
            <button className="flex items-center text-gray-600 hover:text-gray-700 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-blue-600 pl-6 bg-blue-50 py-4">
              {article.excerpt}
            </div>
            
            <div className="article-content">
              {formatContent(article.content)}
            </div>
          </div>

          {/* Article Tags */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Artikel Terkait</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <Link key={relatedArticle.id} href={`/blog/${relatedArticle.slug}`} className="group">
                    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(relatedArticle.publishedAt)}
                          <Clock className="w-4 h-4 ml-4 mr-2" />
                          {relatedArticle.readTime} min
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedArticle.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
