import React, { useEffect, useState } from 'react';
import { Search, Calendar, User, Stethoscope } from 'lucide-react';
import medicalArticlesData from './medicalArticlesData.json';


const MedicalArticlesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFullContent, setShowFullContent] = useState({});
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setArticles(medicalArticlesData.medicalArticles || []);
        setCategories(medicalArticlesData.categories || []);
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === "الكل" || article.category === selectedCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFullContent = (articleId) => {
        setShowFullContent(prev => ({
            ...prev,
            [articleId]: !prev[articleId]
        }));
    };


    return (
        <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <Stethoscope className="h-10 w-10" style={{ color: '#0097A7' }} />
                        <h1 className="text-4xl font-bold" style={{ color: '#212121' }}>المقالات الطبية</h1>
                    </div>
                    <p className="text-lg" style={{ color: '#757575' }}>
                        مصدرك الموثوق للمعلومات الطبية والصحية المفيدة
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="ابحث في المقالات الطبية..."
                            className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:outline-none text-right"
                            style={{ backgroundColor: '#FFFFFF' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                        ? 'text-white shadow-lg'
                                        : 'text-gray-700 bg-white hover:shadow-md'
                                        } border-none outline-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:border-none`}
                                    style={{
                                        backgroundColor: selectedCategory === category ? '#00BCD4' : '#FFFFFF',
                                        border: '1px solid #00BCD4',
                                        outline: 'none',
                                        boxShadow: selectedCategory === category ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : undefined
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Article */}
                {filteredArticles.length > 0 && filteredArticles[0].featured && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#212121' }}>
                            المقال المميز
                        </h2>
                        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#FFFFFF' }}>
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    <img
                                        src={filteredArticles[0].image}
                                        alt={filteredArticles[0].title}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>
                                <div className="md:w-1/2 p-8">
                                    <div className="flex items-center mb-4">
                                        <span
                                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                            style={{ backgroundColor: '#009688' }}
                                        >
                                            {filteredArticles[0].category}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-right" style={{ color: '#212121' }}>
                                        {filteredArticles[0].title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-right leading-relaxed">
                                        {filteredArticles[0].excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" style={{ color: '#757575' }} />
                                            <span className="text-sm" style={{ color: '#757575' }}>
                                                {new Date(filteredArticles[0].date).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4" style={{ color: '#757575' }} />
                                            <span className="text-sm" style={{ color: '#757575' }}>
                                                {filteredArticles[0].author}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFullContent(filteredArticles[0].id)}
                                        className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200 border-none outline-none focus:outline-none focus:ring-0 active:outline-none"
                                        style={{
                                            backgroundColor: '#00BCD4',
                                            border: 'none',
                                            outline: 'none'
                                        }}
                                    >
                                        {showFullContent[filteredArticles[0].id] ? 'إخفاء المقال' : 'قراءة المقال كاملاً'}
                                    </button>
                                </div>
                            </div>
                            {showFullContent[filteredArticles[0].id] && (
                                <div className="px-8 pb-8">
                                    <div className="border-t pt-6" style={{ borderColor: '#BDB0BD' }}>
                                        <p className="text-gray-700 leading-relaxed text-right text-lg">
                                            {filteredArticles[0].content}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Articles Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#212121' }}>
                        جميع المقالات ({filteredArticles.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {filteredArticles.slice(filteredArticles[0]?.featured ? 1 : 0).map((article) => (
                            <div
                                key={article.id}
                                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                style={{ backgroundColor: '#FFFFFF' }}
                            >
                                <div className="relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                            style={{ backgroundColor: '#009688' }}
                                        >
                                            {article.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3 text-right line-clamp-2" style={{ color: '#212121' }}>
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4 text-right leading-relaxed line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between mb-4 text-sm" style={{ color: '#757575' }}>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(article.date).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                        <span>{article.readTime}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4" style={{ color: '#757575' }} />
                                            <span className="text-sm" style={{ color: '#757575' }}>
                                                {article.author}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => toggleFullContent(article.id)}
                                            className="inline-flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all duration-200 border-none outline-none focus:outline-none focus:ring-0 active:outline-none"
                                            style={{
                                                backgroundColor: '#00BCD4',
                                                border: 'none',
                                                outline: 'none'
                                            }}
                                        >
                                            {showFullContent[article.id] ? 'إخفاء' : 'قراءة المزيد'}
                                        </button>
                                    </div>
                                </div>

                                {showFullContent[article.id] && (
                                    <div className="px-6 pb-6">
                                        <div className="border-t pt-4" style={{ borderColor: '#BDB0BD' }}>
                                            <p className="text-gray-700 leading-relaxed text-right">
                                                {article.content}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* No Results */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#212121' }}>
                            لم يتم العثور على مقالات
                        </h3>
                        <p className="text-gray-600">
                            جرب البحث بكلمات مختلفة أو اختر فئة أخرى
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalArticlesPage;