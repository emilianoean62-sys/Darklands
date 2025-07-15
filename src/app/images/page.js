"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/images/ImageGallery';
import ImageSearch from '@/components/images/ImageSearch';
import ImageFilters from '@/components/images/ImageFilters';
import { fetchImages } from '@/lib/konachan';
import { useSession } from 'next-auth/react';

export default function AnimeImages() {
  const { data: session } = useSession();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    rating: 'safe', // safe, questionable, explicit
    order: 'date', // date, popularity, random
    resolution: '' // empty for all, or specific like '1920x1080'
  });

  useEffect(() => {
    loadImages();
  }, [page, searchQuery, filters]);

  const loadImages = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      if (reset) {
        setPage(1);
        setImages([]);
      }

      const newImages = await fetchImages({
        page: currentPage,
        tags: searchQuery,
        limit: 20,
        rating: filters.rating,
        order: filters.order,
        resolution: filters.resolution
      });

      setImages(prev => reset ? newImages : [...prev, ...newImages]);
      setHasMore(newImages.length === 20);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadImages(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    loadImages(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar session={session} />
      
      <main className="container mx-auto px-4 py-8 bg-black">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Anime Images</h1>
          <p className="text-gray-400">
            Discover and download high-quality anime wallpapers and artwork
          </p>
        </div>
        
        <div className="mb-6">
          <ImageSearch onSearch={handleSearch} />
        </div>
        
        <div className="mb-6">
          <ImageFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <ImageGallery 
          images={images} 
          loading={loading} 
          hasMore={hasMore} 
          loadMore={loadMore} 
        />
      </main>
      
      <Footer />
    </div>
  );
}
